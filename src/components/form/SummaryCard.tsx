import React from "react";
import { IndianRupee, Scale, Box } from "lucide-react";
import FormInput from "./FormInput";

interface SummaryCardProps {
  pcs: number;
  weight: string;
  volumetricWeight: string;
  totalAmount: number;
  billingAmount: number;
  amountInWords: string;
  onFieldChange: (field: string, value: any) => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  pcs,
  weight,
  volumetricWeight,
  totalAmount,
  billingAmount,
  amountInWords,
  onFieldChange,
}) => {
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
            onChange={(e) => onFieldChange("pcs", Number(e.target.value))}
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
            onChange={(e) => onFieldChange("volumetricWeight", e.target.value)}
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
            onChange={(e) => onFieldChange("weight", e.target.value)}
            icon={Scale}
            containerClassName="col-span-2"
            className="text-center font-bold text-lg"
          />

          <FormInput
            label="Billable Amount"
            type="number"
            min="0"
            value={billingAmount || ""}
            onChange={(e) => onFieldChange("billingAmount", Number(e.target.value))}
            icon={IndianRupee}
            containerClassName="col-span-2"
            className="text-center font-bold text-lg bg-green-50 border-green-200 text-green-700"
          />

          <div className="col-span-2 mt-4 pt-4 border-t border-gray-100 flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <span className="text-gray-600 font-bold text-lg">
              Total Amount
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
