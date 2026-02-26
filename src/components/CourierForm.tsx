import React, { useState, useEffect } from "react";
import api, {
  getServices,
  getShipmentById,
  updateShipment,
  type Service,
} from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { countryList, countryData } from "../constants/formOptions";
import { numberToWords } from "../utils/numberToWords";
import { pdf } from "@react-pdf/renderer";
import CourierPdf from "./CourierPdf";
import bwipjs from "bwip-js";
import {
  MapPin,
  Calendar,
  FileText,
  Box,
  User,
  Phone,
  Mail,
  CreditCard,
  Anchor,
  Globe,
  Truck,
  Printer,
  Hash,
  Save,
} from "lucide-react";

// Import Reusable Components
import ShipmentSectionCard from "./form/ShipmentSectionCard";
import FormInput from "./form/FormInput";
import FormSelect from "./form/FormSelect";
import FormTextArea from "./form/FormTextArea";
import ShipmentItemsTable from "./form/ShipmentItemsTable";
import SummaryCard from "./form/SummaryCard";

export interface LineItem {
  id: number;
  description: string;
  boxNo: string;
  hsnCode: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface CourierData {
  header: {
    awbNo: string;
    origin: string;
    destination: string;
    date: string;
    invoiceNo: string;
    invoiceDate: string;
    boxNumber: string;
    serviceDetails: string;
    serviceId?: string;
  };
  sender: {
    name: string;
    address: string;
    adhaar: string;
    contact: string;
    email: string;
  };
  receiver: {
    name: string;
    address: string;
    contact: string;
    email: string;
  };
  routing: {
    portOfLoading: string;
  };
  items: LineItem[];
  other: {
    pcs: number;
    weight: string;
    volumetricWeight: string;
    currency: string;
    totalAmount: number;
    amountInWords: string;
    billingAmount: number;
  };
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const FormSkeleton = () => (
  <div className="space-y-8 max-w-[1200px] mx-auto pb-12">
    <div className="flex items-center gap-3">
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const initialFormData: CourierData = {
  header: {
    awbNo: "",
    origin: "",
    destination: "",
    date: "",
    invoiceNo: "",
    invoiceDate: "",
    boxNumber: "",
    serviceDetails: "",
  },
  sender: {
    name: "",
    address: "",
    adhaar: "",
    contact: "",
    email: "",
  },
  receiver: {
    name: "",
    address: "",
    contact: "",
    email: "",
  },
  routing: {
    portOfLoading: "",
  },
  items: [
    {
      id: 1,
      description: "",
      boxNo: "1",
      hsnCode: "",
      quantity: 0,
      rate: 0,
      amount: 0,
    },
  ],
  other: {
    pcs: 0,
    weight: "",
    volumetricWeight: "",
    currency: "INR",
    totalAmount: 0,
    amountInWords: "Zero Only",
    billingAmount: 0,
  },
};

const CourierForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CourierData>(initialFormData);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [dbServices, setDbServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getServices();
        setDbServices(services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchShipmentData = async () => {
      if (!id) {
        setFormData(initialFormData);
        setIsFetching(false);
        return;
      }
      setIsFetching(true);
      try {
        const data = await getShipmentById(id);
        // Map backend snake_case to frontend camelCase
        setFormData({
          header: {
            awbNo: data.awb_no || "",
            origin: data.origin || "",
            destination: data.destination || "",
            date: data.shipment_date
              ? new Date(data.shipment_date).toISOString().slice(0, 16)
              : "",
            invoiceNo: data.invoice_number || "",
            invoiceDate: data.invoice_date
              ? new Date(data.invoice_date).toISOString().split("T")[0]
              : "",
            boxNumber: data.box_count?.toString() || "",
            serviceDetails: data.service_details || "",
            serviceId: data.service_id,
          },
          sender: {
            name: data.sender_name || "",
            address: data.sender_address || "",
            adhaar: data.sender_adhaar || "",
            contact: data.sender_contact || "",
            email: data.sender_email || "",
          },
          receiver: {
            name: data.receiver_name || "",
            address: data.receiver_address || "",
            contact: data.receiver_contact || "",
            email: data.receiver_email || "",
          },
          routing: {
            portOfLoading: data.port_of_loading || "",
          },
          items: Array.isArray(data.packages) ? data.packages : [],
          other: {
            pcs: data.pcs || 0,
            weight: data.weight || "",
            volumetricWeight: data.volumetric_weight || "",
            currency: data.currency || "INR",
            totalAmount: data.total_amount || 0,
            amountInWords: data.amount_in_words || "",
            billingAmount: data.billing_amount || 0,
          },
        });
      } catch (error) {
        console.error("Error fetching shipment data:", error);
        alert("Failed to load shipment data.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchShipmentData();
  }, [id]);

  useEffect(() => {
    if (isEditMode) return; // Don't set default date in edit mode
    const now = new Date();
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setFormData((prev) => ({
      ...prev,
      header: { ...prev.header, date: localIso },
    }));
  }, [isEditMode]);

  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const words = numberToWords(Math.round(total));

    setFormData((prev) => ({
      ...prev,
      other: {
        ...prev.other,
        totalAmount: total,
        amountInWords: words,
      },
    }));
  }, [formData.items]);

  const handleNestedChange = (
    section: keyof CourierData,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleItemChange = (id: number, field: keyof LineItem, value: any) => {
    setFormData((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = Number(updated.quantity) * Number(updated.rate);
          }
          return updated;
        }
        return item;
      });
      return { ...prev, items: newItems };
    });
  };

  const boxCount = parseInt(formData.header.boxNumber) || 1;
  const boxOptions = Array.from({ length: boxCount }, (_, i) => i + 1);

  const addItem = () => {
    const newId =
      formData.items.length > 0
        ? Math.max(...formData.items.map((i) => i.id)) + 1
        : 1;
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          description: "",
          boxNo: "1",
          hsnCode: "",
          quantity: 0,
          rate: 0,
          amount: 0,
        },
      ],
    }));
  };

  const removeItem = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      try {
        if (isEditMode && id) {
          await updateShipment(id, formData);
          console.log("Shipment updated in backend");
          alert("Shipment updated successfully!");
          navigate("/dashboard");
          return; // Prevents PDF generation on update
        } else {
          // Send the nested formData structure directly to match the backend schema
          await api.post("/form/create", formData);
          console.log("Shipment saved to backend");
          navigate("/dashboard");
        }
      } catch (apiError) {
        console.error("Failed to save shipment:", apiError);
        alert("Failed to save shipment to database, but proceeding with PDF.");
      }

      let barcodeBase64 = "";
      try {
        const canvas = document.createElement("canvas");
        bwipjs.toCanvas(canvas, {
          bcid: "code128",
          text: formData.header.awbNo || "12345678",
          scale: 3,
          height: 10,
          includetext: false,
          textxalign: "center",
        });
        barcodeBase64 = canvas.toDataURL("image/png");
      } catch (e) {
        console.error("Barcode Generation Error:", e);
      }

      // let qrCodeBase64 = "";
      // try {
      //   const qrData = `AWB: ${formData.header.awbNo}\nAmount: ${formData.other.totalAmount}`;
      //   qrCodeBase64 = await QRCode.toDataURL(qrData);
      // } catch (e) {
      //   console.error("QR Generation Error:", e);
      // }

      const pdfData = {
        ...formData,
        barcodeBase64,
        // qrCodeBase64,
      };

      const blob = await pdf(<CourierPdf data={pdfData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isFetching) {
    return <FormSkeleton />;
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
          <Truck className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Shipment" : "Create New Shipment"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isEditMode
              ? "Update existing shipment details"
              : "Fill shipment, invoice and package details below"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <ShipmentSectionCard title="Shipment Information" icon={Globe}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormSelect
              label="Origin"
              icon={MapPin}
              options={["Select Origin", ...countryList]}
              value={formData.header.origin}
              onChange={(e) => {
                const val = e.target.value;
                const country = countryData.find((c) => c.name === val);
                setFormData((prev) => ({
                  ...prev,
                  header: { ...prev.header, origin: val },
                  sender: country
                    ? { ...prev.sender, contact: country.prefix + " " }
                    : prev.sender,
                }));
              }}
            />
            <FormSelect
              label="Destination"
              icon={MapPin}
              options={["Select Destination", ...countryList]}
              value={formData.header.destination}
              onChange={(e) => {
                const val = e.target.value;
                const country = countryData.find((c) => c.name === val);
                setFormData((prev) => ({
                  ...prev,
                  header: { ...prev.header, destination: val },
                  receiver: country
                    ? { ...prev.receiver, contact: country.prefix + " " }
                    : prev.receiver,
                }));
              }}
            />
            <FormInput
              label="AWB Number"
              icon={FileText} // Barcode icon not available in default set, using FileText
              value={formData.header.awbNo}
              onChange={(e) =>
                handleNestedChange("header", "awbNo", e.target.value)
              }
              placeholder="Enter AWB No"
              className="font-bold text-primary tracking-wide"
            />
            <FormInput
              label="Date"
              type="datetime-local"
              icon={Calendar}
              value={formData.header.date}
              onChange={(e) =>
                handleNestedChange("header", "date", e.target.value)
              }
            />
          </div>
        </ShipmentSectionCard>
        {/* Invoice Info */}
        <ShipmentSectionCard title="Invoice Details" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Invoice No."
              icon={Hash}
              value={formData.header.invoiceNo}
              onChange={(e) =>
                handleNestedChange("header", "invoiceNo", e.target.value)
              }
              placeholder="Enter Invoice No"
            />
            <FormInput
              label="Invoice Date"
              type="date"
              icon={Calendar}
              value={formData.header.invoiceDate}
              onChange={(e) =>
                handleNestedChange("header", "invoiceDate", e.target.value)
              }
              placeholder="YYYY-MM-DD"
            />
            <FormInput
              label="Total Box No."
              type="number"
              min="1"
              icon={Box}
              value={formData.header.boxNumber}
              onChange={(e) =>
                handleNestedChange("header", "boxNumber", e.target.value)
              }
              placeholder="1"
            />
          </div>
        </ShipmentSectionCard>
        {/* Parties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sender */}
          <ShipmentSectionCard
            title="Exporter (Sender)"
            icon={User}
            className="h-full"
          >
            <div className="space-y-5">
              <FormInput
                label="Sender Name"
                icon={User}
                value={formData.sender.name}
                onChange={(e) =>
                  handleNestedChange("sender", "name", e.target.value)
                }
                placeholder="Company or Person Name"
              />
              <FormTextArea
                label="Address"
                rows={3}
                value={formData.sender.address}
                onChange={(e) =>
                  handleNestedChange("sender", "address", e.target.value)
                }
                placeholder="Full Address"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Adhaar No"
                  icon={CreditCard}
                  value={formData.sender.adhaar}
                  onChange={(e) =>
                    handleNestedChange("sender", "adhaar", e.target.value)
                  }
                  placeholder="Optional"
                />
                <FormInput
                  label="Contact No"
                  icon={Phone}
                  value={formData.sender.contact}
                  onChange={(e) =>
                    handleNestedChange("sender", "contact", e.target.value)
                  }
                  placeholder="+91..."
                />
              </div>
              <FormInput
                label="Email"
                type="email"
                icon={Mail}
                value={formData.sender.email}
                onChange={(e) =>
                  handleNestedChange("sender", "email", e.target.value)
                }
                placeholder="sender@example.com"
              />
            </div>
          </ShipmentSectionCard>

          {/* Receiver */}
          <ShipmentSectionCard
            title="Consignee (Receiver)"
            icon={User}
            className="h-full"
          >
            <div className="space-y-5">
              <FormInput
                label="Receiver Name"
                icon={User}
                value={formData.receiver.name}
                onChange={(e) =>
                  handleNestedChange("receiver", "name", e.target.value)
                }
                placeholder="Company or Person Name"
              />
              <FormTextArea
                label="Address"
                rows={3}
                value={formData.receiver.address}
                onChange={(e) =>
                  handleNestedChange("receiver", "address", e.target.value)
                }
                placeholder="Full Address"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Contact No"
                  icon={Phone}
                  value={formData.receiver.contact}
                  onChange={(e) =>
                    handleNestedChange("receiver", "contact", e.target.value)
                  }
                  placeholder="+1..."
                />
                <FormInput
                  label="Email"
                  type="email"
                  icon={Mail}
                  value={formData.receiver.email}
                  onChange={(e) =>
                    handleNestedChange("receiver", "email", e.target.value)
                  }
                  placeholder="receiver@example.com"
                />
              </div>
            </div>
          </ShipmentSectionCard>
        </div>
        {/* Routing */}
        <ShipmentSectionCard title="Routing Information" icon={Anchor}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Port of Loading"
              icon={Anchor}
              value={formData.routing.portOfLoading}
              onChange={(e) =>
                handleNestedChange("routing", "portOfLoading", e.target.value)
              }
              placeholder="e.g. Mumbai Port"
            />
            <FormSelect
              label="Service Type"
              icon={Truck}
              options={["Select Service", ...dbServices.map((s) => s.name)]}
              value={
                dbServices.find((s) => s.id === formData.header.serviceId)
                  ?.name || ""
              }
              onChange={(e) => {
                const selectedName = e.target.value;
                const selectedService = dbServices.find(
                  (s) => s.name === selectedName,
                );
                setFormData((prev) => ({
                  ...prev,
                  header: {
                    ...prev.header,
                    serviceId: selectedService?.id,
                  },
                }));
              }}
            />
            {formData.header.serviceId &&
              dbServices.find((s) => s.id === formData.header.serviceId)
                ?.name !== "Self" && (
                <FormInput
                  label="Tracking No / Info"
                  icon={FileText}
                  value={formData.header.serviceDetails || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "header",
                      "serviceDetails",
                      e.target.value,
                    )
                  }
                  placeholder="Additional Tracking Info"
                />
              )}
          </div>
        </ShipmentSectionCard>
        {/* Items Table */}
        <ShipmentItemsTable
          items={formData.items}
          onItemChange={handleItemChange}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          boxOptions={boxOptions}
        />
        {/* Summary */}
        <SummaryCard
          pcs={formData.other.pcs}
          weight={formData.other.weight}
          volumetricWeight={formData.other.volumetricWeight}
          totalAmount={formData.other.totalAmount}
          billingAmount={formData.other.billingAmount}
          amountInWords={formData.other.amountInWords}
          onFieldChange={(field, value) =>
            handleNestedChange("other", field, value)
          }
        />
        {/* Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isGenerating}
            className={`
                    w-full md:w-auto px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3
                    ${isGenerating ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700"}
                `}
          >
            {isGenerating ? (
              <>Processing...</>
            ) : (
              <>
                {isEditMode ? (
                  <Save className="h-6 w-6" />
                ) : (
                  <Printer className="h-6 w-6" />
                )}
                {isEditMode ? "Update" : "Generate PDF & Print"}
              </>
            )}
          </button>
        </div>{" "}
      </form>
    </div>
  );
};

export default CourierForm;
