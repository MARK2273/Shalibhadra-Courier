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
        <div className="p-8 md:p-10 bg-gray-50/50 border-r border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <Box className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Shipment Volume</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Physical Parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label="Total Pieces"
              type="number"
              min="0"
              value={pcs || ""}
              onChange={(e) => handleInternalChange("pcs", Number(e.target.value))}
              icon={Box}
              className="font-bold border-gray-200 focus:border-primary transition-all"
            />
            <FormInput
              label="Volumetric Wt. (kg)"
              type="number"
              min="0"
              step="any"
              value={volumetricWeight}
              onChange={(e) => handleInternalChange("volumetricWeight", e.target.value)}
              icon={Scale}
              className="font-bold border-gray-200 focus:border-primary transition-all"
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
                className="font-black text-xl text-center border-gray-200 focus:border-primary transition-all bg-white"
              />
            </div>
          </div>

          <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mb-1">
                  Product Value
                </p>
                <div className="flex items-center text-primary">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  <span className="text-3xl font-black">{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Box className="h-6 w-6 text-primary opacity-40" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Financials & Payment */}
        <div className="p-8 md:p-10 bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-green-100 p-2.5 rounded-xl">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Billing & Payment</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Financial Details</p>
            </div>
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
              className="text-center font-black text-2xl bg-green-50/50 border-green-200 text-green-700 h-16 rounded-2xl transition-all hover:bg-green-50"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormSelect
                label="Payment Status"
                value={paymentStatus}
                onChange={(e) => handleInternalChange("paymentStatus", e.target.value)}
                options={[
                  { value: "Paid", label: "Paid" },
                  { value: "Pending", label: "Pending" },
                ]}
                icon={CreditCard}
                className={`font-bold rounded-xl transition-all ${paymentStatus === 'Paid'
                  ? 'text-green-700 bg-green-50 border-green-100 hover:bg-green-100'
                  : 'text-amber-700 bg-amber-50 border-amber-100 hover:bg-amber-100'
                  }`}
              />
              {paymentType === "Online" && upiConfigs && upiConfigs.length > 0 && (
                <FormSelect
                  label="Select QR/UPI"
                  value={selectedUpiId || ""}
                  onChange={(e) => handleInternalChange("selectedUpiId", e.target.value)}
                  options={upiConfigs.map((config) => ({
                    value: config.id,
                    label: config.display_name,
                  }))}
                  icon={CreditCard}
                />
              )}
            </div>

            {isOwnerMode && (
              <FormInput
                label="Owner Cost (Reference)"
                type="number"
                min="0"
                value={ownerCost || ""}
                onChange={(e) => handleInternalChange("ownerCost", Number(e.target.value))}
                icon={IndianRupee}
                className="text-center font-semibold bg-orange-50 border-orange-100 text-orange-700"
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer: Words & Declaration */}
      <div className="bg-gray-50/80 border-t border-gray-100 p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-2 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
              Amount In Words
            </div>
            <p className="text-gray-900 font-extrabold italic text-xl leading-tight pt-2">
              {amountInWords}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
