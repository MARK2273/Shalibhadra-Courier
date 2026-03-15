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
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Left Side: Physical Measurements & Weight */}
        <div className="p-8 border-r border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/5 p-2 rounded-lg">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-bold text-gray-900">Shipment Volume</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormInput
              label="Total Pieces"
              type="number"
              min="0"
              value={pcs || ""}
              onChange={(e) => handleInternalChange("pcs", Number(e.target.value))}
              icon={Box}
              className="font-semibold border-gray-200 focus:border-primary"
            />
            <FormInput
              label="Volumetric Wt. (kg)"
              type="number"
              min="0"
              step="any"
              value={volumetricWeight}
              onChange={(e) => handleInternalChange("volumetricWeight", e.target.value)}
              icon={Scale}
              className="font-semibold border-gray-200 focus:border-primary"
            />
            <div className="sm:col-span-2">
              <FormInput
                label="Total Weight (Kg)"
                type="number"
                min="0"
                step="any"
                value={weight}
                onChange={(e) => handleInternalChange("weight", e.target.value)}
                icon={Scale}
                className="font-bold text-lg text-center border-gray-200 focus:border-primary bg-white"
              />
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                  Product Value
                </p>
                <div className="flex items-center text-primary">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  <span className="text-2xl font-black">{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <Box className="h-8 w-8 text-gray-100" />
            </div>
          </div>
        </div>

        {/* Right Side: Financials & Payment */}
        <div className="p-8 bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-green-50 p-2 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900">Billing & Payment</h3>
          </div>

          <div className="space-y-6">
            <FormInput
              label="Billable Amount"
              type="number"
              min="0"
              value={billingAmount || ""}
              onChange={(e) => handleInternalChange("billingAmount", Number(e.target.value))}
              icon={IndianRupee}
              error={errors["other.billingAmount"]}
              className="text-center font-bold text-xl bg-gray-50/50 border-gray-200 text-gray-900 h-14 rounded-xl focus:border-green-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormSelect
                label="Currency"
                value={currency}
                onChange={(e) => handleInternalChange("currency", e.target.value)}
                options={currencyOptions}
                icon={CreditCard}
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
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormSelect
                label="Payment Status"
                value={paymentStatus}
                onChange={(e) => handleInternalChange("paymentStatus", e.target.value)}
                options={[
                  { value: "Paid", label: "Paid" },
                  { value: "Pending", label: "Pending" },
                ]}
                icon={CreditCard}
                className={`font-semibold rounded-xl transition-all ${paymentStatus === 'Paid'
                  ? 'text-green-600 bg-green-50/50 border-green-100'
                  : 'text-amber-600 bg-amber-50/50 border-amber-100'
                  }`}
              />
              {paymentType === "Online" && upiConfigs && upiConfigs.length > 0 && (
                <FormSelect
                  label="Select Account"
                  value={selectedUpiId || ""}
                  onChange={(e) => handleInternalChange("selectedUpiId", e.target.value)}
                  options={upiConfigs.map((config) => ({
                    value: config.id,
                    label: config.display_name,
                  }))}
                  icon={CreditCard}
                  error={errors["other.selectedUpiId"]}
                />
              )}
            </div>

            {isOwnerMode && (
              <FormInput
                label="Owner Cost"
                type="number"
                min="0"
                value={ownerCost || ""}
                onChange={(e) => handleInternalChange("ownerCost", Number(e.target.value))}
                icon={IndianRupee}
                className="text-center font-medium bg-gray-50 border-gray-200 text-gray-600 h-10"
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer: Words */}
      <div className="bg-gray-50/50 border-t border-gray-100 p-6 px-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Amount In Words
          </span>
          <p className="text-gray-700 font-bold text-lg">
            {amountInWords}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
