import React, { useState, useEffect, useRef } from "react";
import { Trash2, Plus, Box, ClipboardList, IndianRupee } from "lucide-react";
import { getHsCodes } from "../../api/api";

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
  errors: Record<string, string>;
}

const ItemDescriptionCombobox = React.forwardRef<
  HTMLInputElement,
  {
    value: string;
    onChange: (value: string) => void;
    options: any[];
    error?: string;
    placeholder?: string;
  }
>(
  (
    {
      value,
      onChange,
      options,
      error,
      placeholder = "Search Item Description",
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setSearchTerm(value);
    }, [value]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((opt) =>
      (opt.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()),
    );

    return (
      <div className="relative w-full" ref={wrapperRef}>
        <input
          ref={ref}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`block w-full pl-3 pr-8 py-2 text-sm border rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm font-medium ${
            searchTerm ? "text-gray-900" : "text-gray-400"
          } ${
            error
              ? "border-2 border-red-400 bg-red-50/50 ring-2 ring-red-500/10"
              : "border-gray-200"
          }`}
        />
        <div
          className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto overflow-x-hidden">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm text-gray-900 whitespace-normal break-words"
                  onClick={() => {
                    setSearchTerm(opt.name);
                    onChange(opt.name);
                    setIsOpen(false);
                  }}
                >
                  {opt.name}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No items found
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
ItemDescriptionCombobox.displayName = "ItemDescriptionCombobox";

const ShipmentItemsTable: React.FC<ShipmentItemsTableProps> = ({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  boxOptions,
  errors,
}) => {
  const [hsCodes, setHsCodes] = useState<any[]>([]);

  const prevItemsLength = useRef(items.length);
  const newRowDescriptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (items.length > prevItemsLength.current) {
      if (newRowDescriptionRef.current) {
        newRowDescriptionRef.current.focus();
      }
    }
    prevItemsLength.current = items.length;
  }, [items.length]);

  useEffect(() => {
    const fetchHsCodes = async () => {
      try {
        const data = await getHsCodes();
        setHsCodes(data || []);
      } catch (error) {
        console.error("Failed to fetch HS codes", error);
      }
    };
    fetchHsCodes();
  }, []);

  const handleDescriptionChange = (id: number, value: string) => {
    onItemChange(id, "description", value);
    // Find matching code
    const matchedCode = hsCodes.find((item) => item.name === value);
    if (matchedCode) {
      onItemChange(id, "hsnCode", matchedCode.hs_code || "");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Shipment Items
          </h3>
          {errors["items"] && (
            <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded-full animate-pulse border border-red-100">
              {errors["items"]}
            </span>
          )}
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

      <div className="overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100 hidden md:table-row">
              <th className="px-4 py-4 w-24">Box</th>
              <th className="px-4 py-4 w-[28%]">Description</th>
              <th className="px-4 py-4 w-28">HS Code</th>
              <th className="px-4 py-4 w-28">Qty</th>
              <th className="px-4 py-4 w-28">Rate</th>
              <th className="px-4 py-4 w-32">Amount</th>
              <th className="px-4 py-4 w-12 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr
                key={item.id}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (
                      item.description &&
                      item.quantity > 0 &&
                      item.rate > 0
                    ) {
                      onAddItem();
                    }
                  }
                }}
                className="group hover:bg-blue-50/30 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-none relative"
              >
                {/* Mobile Label */}
                <td className="px-4 py-3 md:py-4 flex flex-col md:table-cell">
                  <span className="md:hidden text-xs font-semibold text-gray-400 mb-1">
                    Box No
                  </span>
                  <div className="relative w-full md:w-24">
                    <select
                      value={item.boxNo}
                      onChange={(e) =>
                        onItemChange(item.id, "boxNo", e.target.value)
                      }
                      className="block w-full pl-3 pr-8 py-2 text-sm border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-primary/20 outline-none appearance-none font-medium shadow-sm transition-all"
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
                  <div className="h-4"></div>
                </td>

                <td className="px-4 py-3 md:py-4 flex flex-col md:table-cell">
                  <span className="md:hidden text-xs font-semibold text-gray-400 mb-1">
                    Description
                  </span>
                  <div className="relative">
                    <ItemDescriptionCombobox
                      ref={
                        items.indexOf(item) === items.length - 1
                          ? newRowDescriptionRef
                          : null
                      }
                      value={item.description}
                      onChange={(val) => handleDescriptionChange(item.id, val)}
                      options={hsCodes}
                      error={errors[`items.${items.indexOf(item)}.description`]}
                    />
                  </div>
                  <div className="h-4">
                    {errors[`items.${items.indexOf(item)}.description`] && (
                      <span className="text-[10px] text-red-500 mt-0.5 ml-1 font-bold animate-in fade-in slide-in-from-top-1 leading-none block">
                        {errors[`items.${items.indexOf(item)}.description`]}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 md:py-4 flex flex-col md:table-cell">
                  <span className="md:hidden text-xs font-semibold text-gray-400 mb-1">
                    HS
                  </span>
                  <input
                    type="text"
                    value={item.hsnCode}
                    placeholder="HS"
                    readOnly
                    className="block w-full px-3 py-2 text-sm border-transparent rounded-lg bg-gray-50 text-gray-500 text-center font-bold shadow-inner cursor-not-allowed outline-none"
                  />
                  <div className="h-4"></div>
                </td>

                <td className="px-4 py-3 md:py-4 flex flex-col md:table-cell">
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
                    className={`block w-full px-2 py-2 text-sm border rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm text-center font-bold text-gray-700 ${
                      errors[`items.${items.indexOf(item)}.quantity`]
                        ? "border-2 border-red-400 bg-red-50/50 ring-2 ring-red-500/10"
                        : "border-gray-200"
                    }`}
                  />
                  <div className="h-4">
                    {errors[`items.${items.indexOf(item)}.quantity`] && (
                      <span className="text-[10px] text-red-500 mt-0.5 font-bold block text-center animate-in fade-in slide-in-from-top-1 leading-none">
                        {errors[`items.${items.indexOf(item)}.quantity`]}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 md:py-4 flex flex-col md:table-cell">
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
                    className={`block w-full px-3 py-2 text-sm border rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm text-center font-medium ${
                      errors[`items.${items.indexOf(item)}.rate`]
                        ? "border-2 border-red-400 bg-red-50/50 ring-2 ring-red-500/10"
                        : "border-gray-200"
                    }`}
                  />
                  <div className="h-4">
                    {errors[`items.${items.indexOf(item)}.rate`] && (
                      <span className="text-[10px] text-red-500 mt-0.5 font-bold block text-center animate-in fade-in slide-in-from-top-1 leading-none">
                        {errors[`items.${items.indexOf(item)}.rate`]}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 md:py-4 flex flex-col md:table-cell">
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
                  <div className="h-4"></div>
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
