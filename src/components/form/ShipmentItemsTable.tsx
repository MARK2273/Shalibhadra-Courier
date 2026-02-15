import React from "react";
import { Trash2, Plus, Box, ClipboardList, IndianRupee } from "lucide-react";

interface LineItem {
  id: number;
  description: string;
  boxNo: string;
  hsnCode: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface ShipmentItemsTableProps {
  items: LineItem[];
  onItemChange: (id: number, field: keyof LineItem, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  boxOptions: number[];
}

const ShipmentItemsTable: React.FC<ShipmentItemsTableProps> = ({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  boxOptions,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Shipment Items
          </h3>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100 hidden md:table-row">
              <th className="px-6 py-4 w-20">Box</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 w-32">HSN Code</th>
              <th className="px-6 py-4 w-24">Qty</th>
              <th className="px-6 py-4 w-32">Rate</th>
              <th className="px-6 py-4 w-32">Amount</th>
              <th className="px-6 py-4 w-16 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr
                key={item.id}
                className="group hover:bg-blue-50/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-none relative"
              >
                {/* Mobile Label */}
                <td className="px-6 py-3 md:py-4 flex flex-col md:table-cell">
                  <span className="md:hidden text-xs font-semibold text-gray-400 mb-1">
                    Box No
                  </span>
                  <div className="relative">
                    <select
                      value={item.boxNo}
                      onChange={(e) =>
                        onItemChange(item.id, "boxNo", e.target.value)
                      }
                      className="block w-full md:w-20 pl-3 pr-8 py-2 text-sm border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-primary/20 outline-none appearance-none font-medium shadow-sm transition-all"
                    >
                      {boxOptions.map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                      <Box className="h-3 w-3" />
                    </div>
                  </div>
                </td>

                <td className="px-6 py-3 md:py-4 flex flex-col md:table-cell">
                  <span className="md:hidden text-xs font-semibold text-gray-400 mb-1">
                    Description
                  </span>
                  <input
                    type="text"
                    value={item.description}
                    placeholder="Item Description"
                    onChange={(e) =>
                      onItemChange(item.id, "description", e.target.value)
                    }
                    className="block w-full px-3 py-2 text-sm border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm placeholder-gray-400 font-medium"
                  />
                </td>

                <td className="px-6 py-3 md:py-4 flex flex-col md:table-cell">
                  <span className="md:hidden text-xs font-semibold text-gray-400 mb-1">
                    HSN
                  </span>
                  <input
                    type="text"
                    value={item.hsnCode}
                    placeholder="HSN"
                    onChange={(e) =>
                      onItemChange(item.id, "hsnCode", e.target.value)
                    }
                    className="block w-full px-3 py-2 text-sm border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm placeholder-gray-400 text-center font-medium"
                  />
                </td>

                <td className="px-6 py-3 md:py-4 flex flex-col md:table-cell">
                  <span className="md:hidden text-xs font-semibold text-gray-400 mb-1">
                    Quantity
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      onItemChange(item.id, "quantity", Number(e.target.value))
                    }
                    className="block w-full px-3 py-2 text-sm border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm text-center font-bold text-gray-700"
                  />
                </td>

                <td className="px-6 py-3 md:py-4 flex flex-col md:table-cell">
                  <span className="md:hidden text-xs font-semibold text-gray-400 mb-1">
                    Rate
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={item.rate || ""}
                    onChange={(e) =>
                      onItemChange(item.id, "rate", Number(e.target.value))
                    }
                    className="block w-full px-3 py-2 text-sm border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm text-center font-medium"
                  />
                </td>

                <td className="px-6 py-3 md:py-4 flex flex-col md:table-cell">
                  <span className="md:hidden text-xs font-semibold text-gray-400 mb-1">
                    Amount
                  </span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <IndianRupee className="h-3 w-3 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={item.amount || ""}
                      readOnly
                      className="block w-full pl-6 pr-3 py-2 text-sm border-transparent rounded-lg bg-gray-50 text-gray-500 font-bold text-right shadow-inner"
                    />
                  </div>
                </td>

                <td className="px-6 py-3 md:py-4 text-right md:flex justify-end items-center absolute md:static top-2 right-2">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Remove Item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  No items added. Click "Add Item" to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentItemsTable;
