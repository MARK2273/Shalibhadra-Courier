import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  FileText,
  CreditCard,
  AlertCircle,
  ExternalLink,
  Printer,
} from "lucide-react";
import api from "../api/api";
import { format } from "date-fns";
import { pdf } from "@react-pdf/renderer";
import CourierPdf from "../components/CourierPdf";
import bwipjs from "bwip-js";
import QRCode from "qrcode";
import type { ShipmentDetail, PackageItem } from "../types/shipment";
import { currentConfig } from "../constants/courierConfig";

/** Reusable info row inside detail cards */
const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-50 last:border-0">
    <span className="text-sm font-medium text-gray-500 sm:w-44 shrink-0">
      {label}
    </span>
    <span className="text-sm text-gray-900 mt-1 sm:mt-0">{value || "—"}</span>
  </div>
);

/** Section card wrapper matching Dashboard theme */
const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-lg">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="px-6 py-4">{children}</div>
  </div>
);

const ShipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipment = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<ShipmentDetail>(`/form/${id}`);
        setShipment(response.data);
      } catch (err: unknown) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 404) {
          setError("Shipment not found. It may have been deleted.");
        } else {
          setError("Failed to load shipment details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShipment();
    }
  }, [id]);

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const handlePrint = async () => {
    if (!shipment) return;

    try {
      let barcodeBase64 = "";
      try {
        const canvas = document.createElement("canvas");
        bwipjs.toCanvas(canvas, {
          bcid: "code128",
          text: shipment.awb_no || "12345678",
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
        const upiId = currentConfig.upiId || "";
        const payeeName = currentConfig.payeeName || "";

        // Use billing amount or fallback to total amount
        const amount = shipment.billing_amount || shipment.total_amount || 0;

        // Construct standard UPI payment link format
        const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;

        qrCodeBase64 = await QRCode.toDataURL(qrData);
      } catch (e) {
        console.error("QR Generation Error:", e);
      }

      // Map snake_case to camelCase for the PDF component
      const pdfData = {
        header: {
          awbNo: shipment.awb_no || "",
          origin: shipment.origin || "",
          destination: shipment.destination || "",
          date: shipment.shipment_date
            ? new Date(shipment.shipment_date).toLocaleString()
            : new Date().toLocaleString(),
          invoiceNo: shipment.invoice_number || "",
          invoiceDate: shipment.invoice_date || "",
          boxNumber: (shipment.box_count || 1).toString(),
          service: shipment.service || "Standard",
          serviceDetails: shipment.service_details || "",
        },
        sender: {
          name: shipment.sender_name || "",
          address: shipment.sender_address || "",
          adhaar: shipment.sender_adhaar || "",
          contact: shipment.sender_contact || "",
          email: shipment.sender_email || "",
        },
        receiver: {
          name: shipment.receiver_name || "",
          address: shipment.receiver_address || "",
          contact: shipment.receiver_contact || "",
          email: shipment.receiver_email || "",
        },
        routing: {
          portOfLoading: shipment.port_of_loading || "",
        },
        items: shipment.packages || [],
        other: {
          pcs: shipment.pcs || 0,
          weight: shipment.weight || "",
          volumetricWeight: shipment.volumetric_weight || "",
          currency: shipment.currency || "INR",
          totalAmount: shipment.total_amount || 0,
          amountInWords: shipment.amount_in_words || "",
          billingAmount: shipment.billing_amount || 0,
        },
        barcodeBase64,
        qrCodeBase64,
      };

      const blob = await pdf(<CourierPdf data={pdfData as any} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("PDF preview error:", err);
      setError("Failed to generate PDF preview.");
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        {Array(3)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {Array(4)
                  .fill(0)
                  .map((_, j) => (
                    <div key={j} className="flex gap-4">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    );
  }

  // --- Error State ---
  if (error || !shipment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-danger opacity-80" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {error || "Something went wrong"}
        </h3>
        <p className="text-gray-500 max-w-sm mb-8">
          We couldn&apos;t load this shipment. Please check the URL or go back
          to the dashboard.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl text-white bg-primary hover:bg-blue-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  // --- Detail View ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Shipment Details
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              AWB: {shipment.awb_no || "N/A"} · Created{" "}
              {formatDate(shipment.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-primary uppercase">
            {shipment.service || "Standard"}
          </span>
          {shipment.tracking_url && (
            <a
              href={shipment.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-primary text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Track Shipment
            </a>
          )}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            View PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Origin",
            value: shipment.origin,
            color: "bg-white",
            text: "text-gray-900",
          },
          {
            label: "Destination",
            value: shipment.destination,
            color: "bg-white",
            text: "text-gray-900",
          },
          {
            label: "Billing Amount",
            value: `₹${(shipment.billing_amount ?? 0).toLocaleString()}`,
            color: "bg-green-50",
            text: "text-green-600",
          },
          {
            label: "Boxes",
            value: shipment.box_count.toString(),
            color: "bg-white",
            text: "text-primary",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl shadow-sm border border-gray-100 ${stat.color}`}
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.text}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Info */}
        <SectionCard
          title="Shipment Information"
          icon={<FileText className="w-5 h-5 text-primary" />}
        >
          <InfoRow label="AWB No." value={shipment.awb_no} />
          <InfoRow
            label="Shipment Date"
            value={formatDate(shipment.shipment_date)}
          />
          <InfoRow label="Invoice No." value={shipment.invoice_number} />
          <InfoRow
            label="Invoice Date"
            value={formatDate(shipment.invoice_date)}
          />
          <InfoRow label="Service" value={shipment.service} />
          <InfoRow label="Service Details" value={shipment.service_details} />
          <InfoRow label="Port of Loading" value={shipment.port_of_loading} />
        </SectionCard>

        {/* Sender */}
        <SectionCard
          title="Sender Details"
          icon={<User className="w-5 h-5 text-primary" />}
        >
          <InfoRow label="Name" value={shipment.sender_name} />
          <InfoRow label="Address" value={shipment.sender_address} />
          <InfoRow label="Contact" value={shipment.sender_contact} />
          <InfoRow label="Email" value={shipment.sender_email} />
          <InfoRow label="Aadhaar" value={shipment.sender_adhaar} />
        </SectionCard>

        {/* Receiver */}
        <SectionCard
          title="Receiver Details"
          icon={<MapPin className="w-5 h-5 text-primary" />}
        >
          <InfoRow label="Name" value={shipment.receiver_name} />
          <InfoRow label="Address" value={shipment.receiver_address} />
          <InfoRow label="Contact" value={shipment.receiver_contact} />
          <InfoRow label="Email" value={shipment.receiver_email} />
        </SectionCard>

        {/* Financials */}
        <SectionCard
          title="Financial Summary"
          icon={<CreditCard className="w-5 h-5 text-primary" />}
        >
          <InfoRow label="Total Pieces" value={shipment.pcs?.toString()} />
          <InfoRow label="Weight" value={shipment.weight} />
          <InfoRow
            label="Volumetric Weight"
            value={shipment.volumetric_weight}
          />
          <InfoRow label="Currency" value={shipment.currency} />
          <InfoRow
            label="Product Value"
            value={
              shipment.total_amount != null
                ? `₹${shipment.total_amount.toLocaleString()}`
                : null
            }
          />
          <InfoRow
            label="Billing Amount"
            value={
              shipment.billing_amount != null
                ? `₹${shipment.billing_amount.toLocaleString()}`
                : null
            }
          />
          <InfoRow label="Amount in Words" value={shipment.amount_in_words} />
        </SectionCard>
      </div>

      {/* Packages Table */}
      {shipment.packages && shipment.packages.length > 0 && (
        <SectionCard
          title="Package Items"
          icon={<Package className="w-5 h-5 text-primary" />}
        >
          <div className="overflow-x-auto -mx-6 -mb-4">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">HS Code</th>
                  <th className="px-6 py-3">Box No.</th>
                  <th className="px-6 py-3 text-right">Qty</th>
                  <th className="px-6 py-3 text-right">Rate</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipment.packages.map((pkg: PackageItem, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {pkg.description || "—"}
                    </td>
                    <td className="px-6 py-3">{pkg.hsCode || "—"}</td>
                    <td className="px-6 py-3">{pkg.boxNo || "—"}</td>
                    <td className="px-6 py-3 text-right">
                      {pkg.quantity ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {pkg.rate != null ? `₹${pkg.rate}` : "—"}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-gray-900">
                      {pkg.amount != null ? `₹${pkg.amount}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default ShipmentDetails;
