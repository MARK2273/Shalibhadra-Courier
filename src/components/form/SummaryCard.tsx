import React from "react";
import { IndianRupee, Scale, Box, CreditCard } from "lucide-react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { type UpiConfig } from "../../types/shipment";

interface SummaryCardProps {
  pcs: number;
  weight: string;
  volumetricWeight: string;
  totalAmount: number;
  billingAmount: number;
  amountInWords: string;
  currency: string;
  paymentType: string;
  paymentStatus: string;
  selectedUpiId?: string | null;
  upiConfigs?: UpiConfig[];
  ownerCost?: number;
  isOwnerMode?: boolean;
  onFieldChange?: (field: string, value: any) => void;
  onNestedChange?: (section: any, field: string, value: any) => void;
  errors: Record<string, string>;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  pcs,
  weight,
  volumetricWeight,
  totalAmount,
  billingAmount,
  amountInWords,
  currency,
  paymentType,
  paymentStatus,
  selectedUpiId,
  upiConfigs,
  ownerCost,
  isOwnerMode,
  onFieldChange,
  onNestedChange,
  errors,
}) => {
  const handleInternalChange = (field: string, value: any) => {
    if (onNestedChange) {
      onNestedChange("other", field, value);
    } else if (onFieldChange) {
      onFieldChange(field, value);
    }
  };
  // const isINR = currency === "INR";

  const currencyOptions = [
    { value: "INR", label: "Indian Rupee (INR)" },
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "AED", label: "UAE Dirham (AED)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "AUD", label: "Australian Dollar (AUD)" },
    { value: "SGD", label: "Singapore Dollar (SGD)" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: Amount in Words & Info */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
              Amount In Words
            </p>
            <p className="text-gray-900 font-medium italic text-lg leading-relaxed">
              {amountInWords}
            </p>
          </div>
          <p className="text-xs text-gray-400 italic border-l-2 border-gray-300 pl-3">
            We declare that this invoice shows the actual price of the good
            described and that all particulars are true and correct.
          </p>
        </div>

        {/* Right: Totals Grid */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Total Pieces"
            type="number"
            min="0"
            value={pcs || ""}
            onChange={(e) => handleInternalChange("pcs", Number(e.target.value))}
            icon={Box}
            containerClassName="col-span-1"
            className="text-center font-bold"
          />
          <FormInput
            label="Volumetric Wt."
            type="number"
            min="0"
            step="any"
            value={volumetricWeight}
            onChange={(e) => handleInternalChange("volumetricWeight", e.target.value)}
            icon={Scale}
            containerClassName="col-span-1"
            className="text-center font-bold"
          />

          <FormInput
            label="Total Weight (Kg)"
            type="number"
            min="0"
            step="any"
            value={weight}
            onChange={(e) => handleInternalChange("weight", e.target.value)}
            icon={Scale}
            containerClassName="col-span-2"
            className="text-center font-bold text-lg"
          />

          <FormSelect
            label="Currency"
            value={currency}
            onChange={(e) => handleInternalChange("currency", e.target.value)}
            options={currencyOptions}
            icon={CreditCard}
            containerClassName="col-span-2"
          />

          <FormInput
            label="Billable Amount"
            type="number"
            min="0"
            value={billingAmount || ""}
            onChange={(e) =>
              handleInternalChange("billingAmount", Number(e.target.value))
            }
            icon={IndianRupee}
            error={errors["other.billingAmount"]}
            containerClassName="col-span-2"
            className="text-center font-bold text-lg bg-green-50 border-green-200 text-green-700"
          />

          <FormSelect
            label="Payment Type"
            value={paymentType}
            onChange={(e) => handleInternalChange("paymentType", e.target.value)}
            options={[
              { value: "Cash", label: "Cash" },
              { value: "Online", label: "Online" },
            ]}
            icon={CreditCard}
            error={errors["other.paymentType"]}
            containerClassName="col-span-2"
          />
          
          <FormSelect
            label="Payment Status"
            value={paymentStatus}
            onChange={(e) => handleInternalChange("paymentStatus", e.target.value)}
            options={[
              { value: "Paid", label: "Paid" },
              { value: "Pending", label: "Pending" },
            ]}
            icon={CreditCard}
            containerClassName="col-span-2"
            className={paymentStatus === 'Paid' ? 'text-green-700 font-bold bg-green-50' : 'text-amber-700 font-bold bg-amber-50'}
          />

          {isOwnerMode && (
            <FormInput
              label="Owner Cost (Shipment Cost)"
              type="number"
              min="0"
              value={ownerCost || ""}
              onChange={(e) =>
                handleInternalChange("ownerCost", Number(e.target.value))
              }
              icon={IndianRupee}
              containerClassName="col-span-2"
              className="text-center font-bold text-lg bg-orange-50 border-orange-200 text-orange-700"
            />
          )}

          {paymentType === "Online" && upiConfigs && upiConfigs.length > 0 && (
            <FormSelect
              label="Select QR/UPI for Payment"
              value={selectedUpiId || ""}
              onChange={(e) =>
                handleInternalChange("selectedUpiId", e.target.value)
              }
              options={upiConfigs.map((config) => ({
                value: config.id,
                label: config.display_name,
              }))}
              icon={CreditCard}
              containerClassName="col-span-2"
            />
          )}

          <div className="col-span-2 mt-4 pt-4 border-t border-gray-100 flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <span className="text-gray-600 font-bold text-lg">
              Product Value
            </span>
            <div className="flex items-center text-primary">
              <IndianRupee className="h-6 w-6" />
              <span className="text-3xl font-extrabold">
                {totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
