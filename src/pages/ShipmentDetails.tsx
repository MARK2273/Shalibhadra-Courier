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
} from "lucide-react";
import api from "../api/api";
import { format } from "date-fns";
import type { ShipmentDetail, PackageItem } from "../types/shipment";

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
