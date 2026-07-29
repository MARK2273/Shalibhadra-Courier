import React, { useState, useEffect } from "react";
import api, {
  getServices,
  getShipmentById,
  updateShipment,
  getUpiConfigs,
  uploadPdf,
  type Service,
  type UpiConfig,
} from "../api/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { countryList, countryData } from "../constants/formOptions";
import { numberToWords } from "../utils/numberToWords";
import { pdf } from "@react-pdf/renderer";
import CourierPdf from "./CourierPdf";
import bwipjs from "bwip-js";
import QRCode from "qrcode";
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
  Copy,
  Lock,
  Building,
} from "lucide-react";
import { useOwnerMode } from "../context/OwnerModeContext";

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
    service?: string;
    shipmentType: "Docs" | "Non-Docs";
  };
  sender: {
    name: string;
    companyName: string;
    address: string;
    adhaar: string;
    contact: string;
    email: string;
    gst?: string;
  };
  receiver: {
    name: string;
    companyName: string;
    address: string;
    contact: string;
    email: string;
  };
  routing: {
    portOfLoading: string;
    finalDestination?: string;
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
    paymentType: "Cash" | "Online";
    selectedUpiId?: string | null;
    paymentStatus: "Paid" | "Pending";
    ownerCost?: number;
    taxType: "none" | "cgst_sgst" | "igst";
    cgst: number;
    sgst: number;
    igst: number;
    taxAmount: number;
    finalBillingAmount: number;
    utrNumber?: string;
    itemCurrency: string;
  };
  barcodeBase64?: string;
  qrCodeBase64?: string;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
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

    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-6 transition-colors">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-6 transition-colors">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-6 transition-colors">
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
    service: "",
    shipmentType: "Non-Docs",
  },
  sender: {
    name: "",
    companyName: "",
    address: "",
    adhaar: "",
    contact: "",
    email: "",
    gst: "",
  },
  receiver: {
    name: "",
    companyName: "",
    address: "",
    contact: "",
    email: "",
  },
  routing: {
    portOfLoading: "",
    finalDestination: "",
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
    paymentType: "Cash",
    selectedUpiId: null,
    paymentStatus: "Pending",
    ownerCost: 0,
    taxType: "none",
    cgst: 0,
    sgst: 0,
    igst: 0,
    taxAmount: 0,
    finalBillingAmount: 0,
    utrNumber: "",
    itemCurrency: "INR",
  },
};

const CourierForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOwnerMode } = useOwnerMode();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CourierData>(initialFormData);
  const [user, setUser] = useState<any>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [upiConfigs, setUpiConfigs] = useState<UpiConfig[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  console.log(errors);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Header Validation
    if (!formData.header.origin || formData.header.origin === "Select Origin")
      newErrors["header.origin"] = "Origin is required";
    if (
      !formData.header.destination ||
      formData.header.destination === "Select Destination"
    )
      newErrors["header.destination"] = "Destination is required";
    if (!formData.header.date)
      newErrors["header.date"] = "Shipment Date is required";
    if (!formData.header.serviceId)
      newErrors["header.serviceId"] = "Service Provider is required";

    // Sender Validation
    if (!formData.sender.name)
      newErrors["sender.name"] = "Sender name is required";
    if (!formData.sender.address)
      newErrors["sender.address"] = "Sender address is required";
    if (!formData.sender.contact)
      newErrors["sender.contact"] = "Sender contact is required";
    if (
      formData.sender.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sender.email)
    ) {
      newErrors["sender.email"] = "Invalid email format";
    }

    // Receiver Validation
    if (!formData.receiver.name)
      newErrors["receiver.name"] = "Receiver name is required";
    if (!formData.receiver.address)
      newErrors["receiver.address"] = "Receiver address is required";
    if (!formData.receiver.contact)
      newErrors["receiver.contact"] = "Receiver contact is required";
    if (
      formData.receiver.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.receiver.email)
    ) {
      newErrors["receiver.email"] = "Invalid email format";
    }

    // Items Validation
    if (formData.header.shipmentType !== "Docs") {
      if (formData.items.length === 0) {
        newErrors["items"] = "At least one item is required";
      } else {
        formData.items.forEach((item, index) => {
          if (!item.description)
            newErrors[`items.${index}.description`] = "Description required";
          if (Number(item.quantity) <= 0)
            newErrors[`items.${index}.quantity`] = "Qty > 0";
          if (Number(item.rate) <= 0) newErrors[`items.${index}.rate`] = "Rate > 0";
        });
      }
    }

    // Summary Validation
    if (formData.other.billingAmount <= 0) {
      newErrors["other.billingAmount"] = "Billing amount required";
    }
    if (!formData.other.paymentType) {
      newErrors["other.paymentType"] = "Payment Type is required";
    }
    if (formData.other.paymentType === "Online" && !formData.other.selectedUpiId) {
      newErrors["other.selectedUpiId"] = "UPI Account is required for Online payments";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
    const fetchUpiConfigs = async () => {
      try {
        const { configs, defaultUpiId } = await getUpiConfigs();
        setUpiConfigs(configs);
        // Only set default if one isn't already selected (important for cloning/editing)
        if (!isEditMode && defaultUpiId && !formData.other.selectedUpiId) {
          setFormData((prev) => ({
            ...prev,
            other: { ...prev.other, selectedUpiId: defaultUpiId },
          }));
        }
      } catch (error) {
        console.error("Error fetching UPI configs:", error);
      }
    };
    fetchUpiConfigs();
  }, [isEditMode]);

  useEffect(() => {
    const fetchShipmentData = async () => {
      // If we are navigating to /form but have cloned data in state, use it
      if (!id && location.state?.clonedData) {
        setFormData(location.state.clonedData);
        setIsFetching(false);
        // Clear the state so it doesn't persist on subsequent refreshes
        window.history.replaceState({}, document.title);
        return;
      }

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
            shipmentType: (data as any).shipment_type || "Non-Docs",
            service: (data as any).service || "Standard",
          },
          sender: {
            name: data.sender_name || "",
            companyName: data.sender_company || "",
            address: data.sender_address || "",
            adhaar: data.sender_adhaar || "",
            contact: data.sender_contact || "",
            email: data.sender_email || "",
            gst: data.sender_gst || "",
          },
          receiver: {
            name: data.receiver_name || "",
            companyName: data.receiver_company || "",
            address: data.receiver_address || "",
            contact: data.receiver_contact || "",
            email: data.receiver_email || "",
          },
          routing: {
            portOfLoading: data.port_of_loading || "",
            finalDestination: data.destination || "",
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
            paymentType: data.payment_type || "Cash",
            selectedUpiId: data.selected_upi_id || null,
            paymentStatus: data.payment_status || "Pending",
            ownerCost: data.owner_cost || 0,
            taxType: data.tax_type || "none",
            cgst: data.cgst || 0,
            sgst: data.sgst || 0,
            igst: data.igst || 0,
            taxAmount: data.tax_amount || 0,
            finalBillingAmount: data.final_billing_amount || data.billing_amount || 0,
            utrNumber: data.utr_number || "",
            itemCurrency: data.item_currency || "INR",
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
    setFormData((prev) => ({
      ...prev,
      other: {
        ...prev.other,
        totalAmount: total,
      },
    }));
  }, [formData.items]);

  useEffect(() => {
    const basicAmount = formData.other.billingAmount || 0;
    const effectiveTaxType = user?.can_show_tax === false ? "none" : formData.other.taxType;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let taxAmount = 0;

    if (effectiveTaxType === "cgst_sgst") {
      cgst = Number((basicAmount * 0.09).toFixed(2));
      sgst = Number((basicAmount * 0.09).toFixed(2));
      taxAmount = cgst + sgst;
    } else if (effectiveTaxType === "igst") {
      igst = Number((basicAmount * 0.18).toFixed(2));
      taxAmount = igst;
    }

    const finalTotal = Number((basicAmount + taxAmount).toFixed(2));
    const words = numberToWords(Math.round(finalTotal));

    setFormData((prev) => ({
      ...prev,
      other: {
        ...prev.other,
        cgst,
        sgst,
        igst,
        taxAmount,
        finalBillingAmount: finalTotal,
        amountInWords: words,
      },
    }));
  }, [formData.other.billingAmount, formData.other.taxType]);

  const handleClone = () => {
    // Reset unique/temporary fields
    const clonedData: CourierData = {
      ...formData,
      header: {
        ...formData.header,
        awbNo: "",
        invoiceNo: "",
        invoiceDate: "",
        // Keep origin, destination, serviceId, etc.
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16),
      },
      // Keep sender, receiver, items as they are
    };

    // Step 2: Change to create mode by navigating with the cloned data in state
    navigate("/form", { state: { clonedData } });

    setSubmitStatus({
      type: "success",
      message: "Shipment details cloned! You are now creating a new shipment.",
    });
  };

  const handleNestedChange = (
    section: keyof CourierData,
    field: string,
    value: any,
  ) => {
    let finalValue = value;

    // Side effect: If switching to Online, auto-select a UPI if none is selected
    if (section === "other" && field === "paymentType" && value === "Online") {
      if (!formData.other.selectedUpiId && upiConfigs.length > 0) {
        const defaultUpi = upiConfigs.find(c => c.is_active) || upiConfigs[0];
        setFormData(prev => ({
          ...prev,
          other: {
            ...prev.other,
            paymentType: "Online",
            selectedUpiId: defaultUpi.id
          }
        }));
        return; // setFormData already handled
      }
    }

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: finalValue,
      },
    }));

    // Clear error for this field
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
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

    // Clear item errors
    setErrors((prev) => {
      const next = { ...prev };
      // We search for the key across all items to be safe from index shifts
      // or we just clear the specific field if it exists
      Object.keys(next).forEach(key => {
        if (key.includes(`items.`) && key.endsWith(`.${field}`)) {
          // If the current value is valid, we can clear this error
          // But here we just clear the specific ID's error if possible
        }
      });

      // Traditional way with fixed index (works for simple cases)
      const itemIndex = formData.items.findIndex((i) => i.id === id);
      const errorKey = `items.${itemIndex}.${field}`;
      if (next[errorKey]) delete next[errorKey];
      if (next["items"]) delete next["items"];
      return next;
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

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the validation errors before submitting.",
      });
      // Scroll to error (optional improvement)
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitStatus(null);
    setIsGenerating(true);

    let updatedFormData = formData;
    try {
      try {
        let generatedAwb = formData.header.awbNo;
        let shipmentId = id;

        if (isEditMode && id) {
          await updateShipment(id, formData);
          setSubmitStatus({
            type: "success",
            message: "Shipment updated successfully!",
          });
        } else {
          const response = await api.post("/form/create", formData);
          generatedAwb = response.data.awb_no;
          shipmentId = response.data.id;
          setSubmitStatus({
            type: "success",
            message: "Shipment created successfully!",
          });
        }

        // Update formData with the generated AWB for PDF generation
        updatedFormData = {
          ...formData,
          header: { ...formData.header, awbNo: generatedAwb },
        };

        // We'll upload the PDF after generating it below
        (updatedFormData as any)._shipmentId = shipmentId;
      } catch (apiError) {
        console.error("Failed to save shipment:", apiError);
        setSubmitStatus({
          type: "error",
          message:
            "Failed to save to database. Proceeding with PDF generation...",
        });
      }

      let barcodeBase64 = "";
      try {
        const canvas = document.createElement("canvas");
        bwipjs.toCanvas(canvas, {
          bcid: "code128",
          text: updatedFormData.header.awbNo || "12345678",
          scale: 3,
          height: 10,
          includetext: false,
          textxalign: "center",
        });
        barcodeBase64 = canvas.toDataURL("image/png");
      } catch (e) {
        console.error("Barcode Generation Error:", e);
      }

      let qrCodeBase64 = "";
      try {
        // Use billing amount or fallback to total amount
        const amount =
          formData.other.finalBillingAmount || formData.other.billingAmount || formData.other.totalAmount || 0;

        // Get selected UPI details from state
        const selectedUpi = upiConfigs.find(
          (c) => c.id === formData.other.selectedUpiId,
        );
        const upiId = selectedUpi?.upi_id || "";
        const payeeName = selectedUpi?.payee_name || "";

        // Construct standard UPI payment link format
        const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
          payeeName,
        )}&am=${amount}&cu=INR`;

        qrCodeBase64 = await QRCode.toDataURL(qrData);
      } catch (e) {
        console.error("QR Generation Error:", e);
      }

      const pdfData = {
        ...updatedFormData,
        header: {
          ...updatedFormData.header,
          service:
            dbServices.find((s) => s.id === formData.header.serviceId)?.name ||
            formData.header.service ||
            "Standard",
        },
        routing: {
          ...formData.routing,
          finalDestination: formData.header.destination,
        },
        barcodeBase64,
        qrCodeBase64,
      };

      const blob = await pdf(<CourierPdf data={pdfData} />).toBlob();

      // Upload PDF to Supabase
      const shipmentId = (updatedFormData as any)._shipmentId;
      if (shipmentId) {
        try {
          const redirectUrl = await uploadPdf(shipmentId, blob);
          if (redirectUrl) {
            window.open(redirectUrl, "_blank");
          } else {
            // Fallback to blob URL if upload didn't return a redirect link
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
          }
        } catch (uploadError) {
          console.error("Failed to upload PDF reference:", uploadError);
          // Fallback to local preview if upload fails
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
        }
      } else {
        // Fallback for cases where no shipment ID exists (shouldn't happen here)
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }

      if (!isEditMode) {
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSubmitStatus({
        type: "error",
        message: "Error generating PDF. Check console for details.",
      });
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
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <Truck className="h-8 w-8 text-primary dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Shipment" : "Create New Shipment"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isEditMode
              ? "Update existing shipment details"
              : "Fill shipment, invoice and package details below"}
          </p>
        </div>

        {isEditMode && (
          <button
            type="button"
            onClick={handleClone}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-800 font-medium"
          >
            <Copy className="h-4 w-4" />
            Clone Shipment
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
          }
        }}
        className="space-y-8"
      >
        {/* Header Section */}
        <ShipmentSectionCard title="Shipment Information" icon={Globe}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormSelect
              label="Origin"
              icon={MapPin}
              options={["Select Origin", ...countryList]}
              value={formData.header.origin}
              error={errors["header.origin"]}
              isSearchable={true}
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

                // Clear error
                if (errors["header.origin"]) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next["header.origin"];
                    return next;
                  });
                }
              }}
            />
            <FormSelect
              label="Destination"
              icon={MapPin}
              options={["Select Destination", ...countryList]}
              value={formData.header.destination}
              error={errors["header.destination"]}
              isSearchable={true}
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

                // Clear error
                if (errors["header.destination"]) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next["header.destination"];
                    return next;
                  });
                }
              }}
            />
            <FormInput
              label="Date"
              type="datetime-local"
              icon={Calendar}
              value={formData.header.date}
              error={errors["header.date"]}
              onChange={(e) =>
                handleNestedChange("header", "date", e.target.value)
              }
            />
            <FormSelect
              label="Shipment Type"
              icon={FileText}
              options={["Non-Docs", "Docs"]}
              value={formData.header.shipmentType}
              onChange={(e) => {
                const val = e.target.value as "Docs" | "Non-Docs";
                handleNestedChange("header", "shipmentType", val);
                if (val === "Docs") {
                  // Optionally clear items if switching to Docs
                  setFormData(prev => ({ ...prev, items: [] }));
                }
              }}
            />
            <FormInput
              label={isEditMode ? "AWB No. (Locked)" : "AWB No. (Optional)"}
              icon={Hash}
              value={formData.header.awbNo}
              disabled={isEditMode}
              onChange={(e) =>
                handleNestedChange("header", "awbNo", e.target.value)
              }
              placeholder={isEditMode ? "" : "Leave blank for auto-generation"}
              title={isEditMode ? "AWB number cannot be changed after creation" : "Enter a custom AWB number or leave blank to auto-generate"}
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
                error={errors["sender.name"]}
                onChange={(e) =>
                  handleNestedChange("sender", "name", e.target.value)
                }
                placeholder="Person Name"
              />
              <FormInput
                label="Company Name (Optional)"
                icon={Building}
                value={formData.sender.companyName}
                onChange={(e) =>
                  handleNestedChange("sender", "companyName", e.target.value)
                }
                placeholder="Company Name"
              />
              <FormTextArea
                label="Address"
                rows={3}
                value={formData.sender.address}
                error={errors["sender.address"]}
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
                  error={errors["sender.contact"]}
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
                error={errors["sender.email"]}
                onChange={(e) =>
                  handleNestedChange("sender", "email", e.target.value)
                }
                placeholder="sender@example.com"
              />
              {(user?.can_show_tax !== false) && (
                <FormInput
                  label="Customer GST Number"
                  placeholder="e.g. 24AAAAA0000A1Z5"
                  value={formData.sender.gst || ""}
                  onChange={(e) =>
                    handleNestedChange("sender", "gst", e.target.value)
                  }
                  icon={Hash}
                  error={errors["sender.gst"]}
                />
              )}
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
                error={errors["receiver.name"]}
                onChange={(e) =>
                  handleNestedChange("receiver", "name", e.target.value)
                }
                placeholder="Person Name"
              />
              <FormInput
                label="Company Name (Optional)"
                icon={Building}
                value={formData.receiver.companyName}
                onChange={(e) =>
                  handleNestedChange("receiver", "companyName", e.target.value)
                }
                placeholder="Company Name"
              />
              <FormTextArea
                label="Address"
                rows={3}
                value={formData.receiver.address}
                error={errors["receiver.address"]}
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
                  error={errors["receiver.contact"]}
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
                  error={errors["receiver.email"]}
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
              error={errors["header.serviceId"]}
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

                // Clear error
                if (errors["header.serviceId"]) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next["header.serviceId"];
                    return next;
                  });
                }
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
        {/* Items Table / Docs Remark */}
        {formData.header.shipmentType === "Docs" ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-3xl p-8 text-center space-y-3 transition-colors">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Document Shipment</h3>
            <p className="text-blue-700 dark:text-blue-200 max-w-md mx-auto">
              This shipment is regarding the document only. No item details are required.
            </p>
          </div>
        ) : (
          <ShipmentItemsTable
            items={formData.items}
            onItemChange={handleItemChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            boxOptions={boxOptions}
            errors={errors}
          />
        )}
        {/* Summary */}
        <div className="relative">
          {isOwnerMode && (
            <div className="absolute -top-4 -right-2 z-10 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 flex items-center gap-1 shadow-sm">
              <Lock className="h-3 w-3" />
              Owner Mode
            </div>
          )}
          <SummaryCard
            pcs={formData.other.pcs}
            weight={formData.other.weight}
            volumetricWeight={formData.other.volumetricWeight}
            totalAmount={formData.other.totalAmount}
            billingAmount={formData.other.billingAmount}
            finalBillingAmount={formData.other.finalBillingAmount}
            taxType={formData.other.taxType}
            cgst={formData.other.cgst}
            sgst={formData.other.sgst}
            igst={formData.other.igst}
            amountInWords={formData.other.amountInWords}
            currency={formData.other.currency}
            paymentType={formData.other.paymentType}
            selectedUpiId={formData.other.selectedUpiId}
            upiConfigs={upiConfigs}
            paymentStatus={formData.other.paymentStatus}
            ownerCost={formData.other.ownerCost}
            utrNumber={formData.other.utrNumber}
            itemCurrency={formData.other.itemCurrency}
            isOwnerMode={isOwnerMode}
            canShowTax={user?.can_show_tax !== false}
            onNestedChange={handleNestedChange}
            errors={errors}
          />
        </div>
        {/* Status Message */}
        {submitStatus && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${submitStatus.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
              }`}
          >
            <div
              className={`p-1.5 rounded-full ${submitStatus.type === "success" ? "bg-green-100 dark:bg-green-900/40" : "bg-red-100 dark:bg-red-900/40"}`}
            >
              {submitStatus.type === "success" ? (
                <Save className="h-4 w-4" />
              ) : (
                <Hash className="h-4 w-4" />
              )}
            </div>
            <p className="font-bold text-sm">{submitStatus.message}</p>
          </div>
        )}
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
