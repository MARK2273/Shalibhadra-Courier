import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ChevronLeft, ChevronRight, Edit2, XCircle, Eye, Package, Lock, Unlock, TrendingUp, TrendingDown, Minus, CreditCard, Loader2, Trash2, Ban, Download } from "lucide-react";
import api, { cancelShipment, updatePaymentStatus, permanentDeleteShipment, exportShipments } from "../api/api";
import Modal from "../components/ui/Modal";
import Tooltip from "../components/ui/Tooltip";
import FilterPopover from "../components/ui/FilterPopover";
import type { FilterField } from "../components/ui/FilterPopover";
import { useOwnerMode } from "../context/OwnerModeContext";
import { format } from "date-fns";
import type { Shipment } from "../types/shipment";

// Simple Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

const FILTER_STORAGE_KEY = 'dashboard_filters';

const getStoredFilters = () => {
  try {
    const stored = localStorage.getItem(FILTER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return null;
};

const Dashboard: React.FC = () => {
  const storedFilters = getStoredFilters();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load
  const [search, setSearch] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState<"All" | "Paid" | "Pending" | "Cancelled">(storedFilters?.status || "All");
  const [activePaymentTypeFilter, setActivePaymentTypeFilter] = useState<"All" | "Cash" | "Online">(storedFilters?.paymentType || "All");
  const [activeTaxFilter, setActiveTaxFilter] = useState<"All" | "Taxed" | "Non-Taxed">(storedFilters?.taxFilter || "All");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOwnerCost, setTotalOwnerCost] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState({
    thisMonthRevenue: 0,
    thisMonthCost: 0,
    lastMonthRevenue: 0,
    lastMonthCost: 0,
  });
  const [financialBreakdown, setFinancialBreakdown] = useState({
    collected: {
      cash: 0,
      upi: 0,
      upiBreakdown: [] as { amount: number; name: string }[],
      total: 0
    },
    pending: {
      cash: 0,
      upi: 0,
      upiBreakdown: [] as { amount: number; name: string }[],
      total: 0
    }
  });
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    id: string;
  }>({
    isOpen: false,
    id: "",
  });
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Permanent Delete State (Admin Only)
  const [permanentDeleteModal, setPermanentDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    awb: string;
  }>({
    isOpen: false,
    id: "",
    awb: "",
  });
  const [isPermanentDeleting, setIsPermanentDeleting] = useState(false);
  const [permanentDeleteError, setPermanentDeleteError] = useState<string | null>(null);

  // Export State
  const [exportModal, setExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Check if current user is admin (can_show_tax)
  const isAdminUser = React.useMemo(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.can_show_tax === true;
      }
    } catch {
      // Ignore parse errors
    }
    return false;
  }, []);

  const { isOwnerMode, setOwnerMode } = useOwnerMode();
  const [ownerModal, setOwnerModal] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [isVerifyingOwner, setIsVerifyingOwner] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    id: string;
    newStatus: Shipment['payment_status'];
  }>({
    isOpen: false,
    id: "",
    newStatus: 'Pending',
  });

  // Persist filters to localStorage whenever they change
  React.useEffect(() => {
    const filters = {
      status: activeStatusFilter,
      paymentType: activePaymentTypeFilter,
      taxFilter: activeTaxFilter,
    };
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [activeStatusFilter, activePaymentTypeFilter, activeTaxFilter]);

  // Consolidated effect for fetching shipments
  React.useEffect(() => {
    // Debounce logic: Only delay if there's a search term
    const delay = search ? 500 : 0;

    const timer = setTimeout(() => {
      fetchShipments();
    }, delay);

    return () => clearTimeout(timer);
  }, [page, search, activeStatusFilter, activePaymentTypeFilter, activeTaxFilter]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const statusParam = activeStatusFilter !== "All" ? `&status=${activeStatusFilter}` : "";
      const paymentParam = activePaymentTypeFilter !== "All" ? `&paymentType=${activePaymentTypeFilter}` : "";
      const taxParam = activeTaxFilter !== "All" ? `&taxFilter=${activeTaxFilter}` : "";
      const response = await api.get(
        `/form/mydata?page=${page}&limit=10&search=${search}${statusParam}${paymentParam}${taxParam}`,
      );
      setShipments(response.data.data);
      setTotalPages(response.data.meta.totalPages);
      setTotalCount(response.data.meta.total);
      setTotalRevenue(response.data.meta.totalRevenue);
      setTotalOwnerCost(response.data.meta.totalOwnerCost || 0);
      setMonthlyStats({
        thisMonthRevenue: response.data.meta.thisMonthRevenue || 0,
        thisMonthCost: response.data.meta.thisMonthCost || 0,
        lastMonthRevenue: response.data.meta.lastMonthRevenue || 0,
        lastMonthCost: response.data.meta.lastMonthCost || 0,
      });
      setFinancialBreakdown({
        collected: response.data.meta.collected || { cash: 0, upi: 0, upiBreakdown: [], total: 0 },
        pending: response.data.meta.pending || { cash: 0, upi: 0, upiBreakdown: [], total: 0 },
      });
      setInitialLoad(false);
    } catch (error) {
      console.error("Failed to fetch shipments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (id: string, _awb: string) => {
    setCancelModal({ isOpen: true, id });
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await cancelShipment(cancelModal.id);
      // Refresh the list
      fetchShipments();
      setCancelModal({ isOpen: false, id: "" });
    } catch (error) {
      console.error("Failed to cancel shipment", error);
      setCancelError("Failed to cancel shipment. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePermanentDeleteClick = (id: string, awb: string) => {
    setPermanentDeleteModal({ isOpen: true, id, awb });
  };

  const handleConfirmPermanentDelete = async () => {
    setIsPermanentDeleting(true);
    setPermanentDeleteError(null);
    try {
      await permanentDeleteShipment(permanentDeleteModal.id);
      fetchShipments();
      setPermanentDeleteModal({ isOpen: false, id: "", awb: "" });
    } catch (error: any) {
      console.error("Failed to permanently delete shipment", error);
      const errorMsg = error?.response?.data?.message || "Failed to permanently delete shipment. Please try again.";
      setPermanentDeleteError(errorMsg);
    } finally {
      setIsPermanentDeleting(false);
    }
  };

  const handleStatusToggle = (id: string, currentStatus: Shipment['payment_status']) => {
    const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    setStatusModal({ isOpen: true, id, newStatus });
  };

  const handleConfirmStatusToggle = async () => {
    const { id, newStatus } = statusModal;
    const currentStatus = newStatus === 'Paid' ? 'Pending' : 'Paid';

    setTogglingId(id);
    setStatusModal(prev => ({ ...prev, isOpen: false }));

    // Optimistic Update
    setShipments(prev => prev.map(s => s.id === id ? { ...s, payment_status: newStatus as 'Paid' | 'Pending' | 'Cancelled' } : s));

    try {
      await updatePaymentStatus(id, newStatus as 'Paid' | 'Pending');
      // Update financial breakdown after status change
      fetchShipments();
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert on error
      setShipments(prev => prev.map(s => s.id === id ? { ...s, payment_status: currentStatus } : s));
    } finally {
      setTogglingId(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportShipments(exportStartDate, exportEndDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "shipments_export.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setExportModal(false);
      setExportStartDate("");
      setExportEndDate("");
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to export shipments. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Filter configuration
  const filterFields: FilterField[] = [
    {
      id: 'status',
      label: 'Payment Status',
      type: 'select',
      options: [
        { label: 'All Status', value: 'All' },
        { label: 'Paid Only', value: 'Paid' },
        { label: 'Pending Only', value: 'Pending' },
        { label: 'Cancelled Only', value: 'Cancelled' },
      ],
    },
    {
      id: 'paymentType',
      label: 'Payment Method',
      type: 'select',
      options: [
        { label: 'All Methods', value: 'All' },
        { label: 'Cash Only', value: 'Cash' },
        { label: 'Online Only', value: 'Online' },
      ],
    },
    {
      id: 'taxFilter',
      label: 'Bill Type',
      type: 'select',
      options: [
        { label: 'All Bills', value: 'All' },
        { label: 'Taxed Bills Only', value: 'Taxed' },
        { label: 'Non-Taxed (Plain)', value: 'Non-Taxed' },
      ],
    },
  ];

  const handleApplyFilters = (values: Record<string, any>) => {
    setActiveStatusFilter(values.status || 'All');
    setActivePaymentTypeFilter(values.paymentType || 'All');
    setActiveTaxFilter(values.taxFilter || 'All');
    setPage(1);
  };

  const handleClearAllFilters = () => {
    setActiveStatusFilter('All');
    setActivePaymentTypeFilter('All');
    setActiveTaxFilter('All');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <button
            onClick={() => {
              if (isOwnerMode) {
                setOwnerMode(false);
              } else {
                setOwnerModal(true);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isOwnerMode
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {isOwnerMode ? (
              <>
                <Unlock className="w-4 h-4" />
                Owner Mode ON
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Owner Mode OFF
              </>
            )}
          </button>
        </div>
        {shipments.length > 0 && (
          <Link
            to="/form"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Shipment
          </Link>
        )}
      </div>

      {/* Stats Cards - Only show if there is data, or show zeros? 
          User didn't specify, but usually dashboards show 0s or empty state. 
          The request was specifically about the TABLE. 
          I'll keep stats visible but showing 0s for now to look "clean" or maybe hide them? 
          "The table should ONLY display rows when actual shipment data exists... If shipment list is empty or null, show a modern empty state instead of fake rows." 
          I will keep stats cards but with 0 values to reflect empty state.
      */}
      {/* Stats Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isOwnerMode ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-4`}>
        {loading && initialLoad
          ? // Skeleton for Stats
          Array(4)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors"
              >
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))
          : // Actual Stats
          [
            {
              label: "Total Shipments",
              value: totalCount.toString(),
              color: "bg-white dark:bg-gray-800",
              text: "text-primary dark:text-blue-400",
            },
            {
              label: "Total Revenue",
              value: `₹${totalRevenue.toLocaleString()}`,
              color: "bg-green-50 dark:bg-green-900/20",
              text: "text-green-600 dark:text-green-400",
            },
            ...(isOwnerMode
              ? [
                {
                  label: "Total Owner Cost",
                  value: `₹${totalOwnerCost.toLocaleString()}`,
                  color: "bg-orange-50 dark:bg-orange-900/20",
                  text: "text-orange-600 dark:text-orange-400",
                },
                {
                  label: "Total Profit",
                  value: `₹${(totalRevenue - totalOwnerCost).toLocaleString()}`,
                  color: "bg-blue-50 dark:bg-blue-900/20",
                  text:
                    totalRevenue - totalOwnerCost >= 0
                      ? "text-blue-600"
                      : "text-red-600",
                },
              ]
              : []),
          ].map((stat, idx) => {
            const renderTrend = (current: number, prev: number, isBadWhenUp = false) => {
              if (prev === 0) return null;
              const diff = ((current - prev) / prev) * 100;
              const isPositive = diff >= 0;
              const isFavorable = isBadWhenUp ? !isPositive : isPositive;

              return (
                <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${isFavorable ? 'text-green-600' : 'text-red-600'}`}>
                  {diff === 0 ? (
                    <Minus className="w-3 h-3" />
                  ) : isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(diff).toFixed(1)}% vs last month
                </div>
              );
            };

            return (
              <div
                key={idx}
                className={`p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${stat.color} flex flex-col justify-between transition-colors`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className={`mt-2 text-3xl font-bold ${stat.text}`}>
                    {stat.value}
                  </p>
                </div>
                {isOwnerMode && stat.label !== "Total Shipments" && (
                  <>
                    {stat.label === "Total Revenue" && renderTrend(monthlyStats.thisMonthRevenue, monthlyStats.lastMonthRevenue)}
                    {stat.label === "Total Owner Cost" && renderTrend(monthlyStats.thisMonthCost, monthlyStats.lastMonthCost, true)}
                    {stat.label === "Total Profit" && renderTrend(
                      monthlyStats.thisMonthRevenue - monthlyStats.thisMonthCost,
                      monthlyStats.lastMonthRevenue - monthlyStats.lastMonthCost
                    )}
                  </>
                )}
              </div>
            );
          })}
      </div>
      {/* Owner Financial Insights Breakdown */}
      {isOwnerMode && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-8 mt-2">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-900/5 dark:shadow-black/20 overflow-hidden transition-colors">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Financial Overview</h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">Global metrics</p>
                </div>
              </div>
              <div className="flex gap-12">
                <div className="text-right">
                  <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-tighter">Total Collected</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">₹{financialBreakdown.collected.total.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tighter">Total Pending</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">₹{financialBreakdown.pending.total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2">

                {/* Collected Side */}
                <div className="space-y-6 lg:pr-12 lg:border-r lg:border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Collection Breakdown</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-orange-50/10 dark:bg-orange-900/10 rounded-2xl border border-orange-100/50 dark:border-orange-900/50 group transition-all hover:border-orange-200/50 dark:hover:border-orange-800/50 hover:bg-orange-50/20 dark:hover:bg-orange-900/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors">
                          <Package className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Cash in Hand</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white text-lg">₹{financialBreakdown.collected.cash.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3 p-4 bg-blue-50/5 dark:bg-blue-900/10 rounded-2xl border border-blue-100/20 dark:border-blue-900/30 transition-all hover:border-blue-100/40 dark:hover:border-blue-800/40">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                            <CreditCard
                              className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">UPI Transfers</span>
                        </div>
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">₹{financialBreakdown.collected.upi.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pl-11">
                        {financialBreakdown.collected.upiBreakdown.map((upi, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100/50 dark:border-gray-700/50">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 truncate mr-2">{upi.name}</span>
                            <span className="text-[11px] font-black text-gray-700 dark:text-gray-300">₹{upi.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Side */}
                <div className="space-y-6 lg:pl-12">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Breakdown</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50/10 dark:bg-gray-800/20 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 group transition-all hover:border-gray-200/50 dark:hover:border-gray-600/50 hover:bg-gray-50/20 dark:hover:bg-gray-800/40">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 dark:text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                          <Package className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 italic">Expected Cash</span>
                      </div>
                      <span className="font-bold text-gray-400 dark:text-gray-300 text-lg">₹{financialBreakdown.pending.cash.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3 p-4 bg-amber-50/5 dark:bg-amber-900/10 rounded-2xl border border-amber-100/20 dark:border-amber-900/30 transition-all hover:border-amber-100/40 dark:hover:border-amber-800/40">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                            <Lock className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Expected UPI</span>
                        </div>
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-lg">₹{financialBreakdown.pending.upi.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pl-11">
                        {financialBreakdown.pending.upiBreakdown.map((upi, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 px-3 bg-amber-50/30 dark:bg-amber-900/20 rounded-xl border border-amber-100/30 dark:border-amber-800/30">
                            <span className="text-[10px] font-bold text-amber-600/60 dark:text-amber-500/80 truncate mr-2">{upi.name}</span>
                            <span className="text-[11px] font-black text-amber-900 dark:text-amber-400">₹{upi.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Shipments Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[400px] flex flex-col transition-colors">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Shipments
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                id="dashboard-search"
                name="dashboard-search"
                autoComplete="off"
                placeholder="Search shipments..."
                className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 bg-white dark:bg-gray-900 dark:text-white transition-colors"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            {/* Reusable Filter Popover */}
            <FilterPopover
              fields={filterFields}
              currentValues={{ 
                status: activeStatusFilter, 
                paymentType: activePaymentTypeFilter,
                taxFilter: activeTaxFilter 
              }}
              onApply={handleApplyFilters}
              onClear={handleClearAllFilters}
              activeFilterCount={
                (activeStatusFilter !== 'All' ? 1 : 0) + 
                (activePaymentTypeFilter !== 'All' ? 1 : 0) +
                (activeTaxFilter !== 'All' ? 1 : 0)
              }
            />
            {isAdminUser && (
              <button
                onClick={() => setExportModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>
        </div>

        {loading ? (
          // Table Row Skeletons
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">AWB No.</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Phone Number</th>
                  <th className="px-6 py-3">Sender</th>
                  <th className="px-6 py-3">Receiver</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  {isOwnerMode && <th className="px-6 py-3 text-right">Cost</th>}
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" /> {/* Payment Method */}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        <Skeleton className="h-4 w-20 ml-auto" /> {/* Amount */}
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-16 mx-auto" /> {/* Status */}
                      </td>
                      {isOwnerMode && (
                        <td className="px-6 py-4 text-right font-medium">
                          <Skeleton className="h-4 w-16 ml-auto" /> {/* Cost */}
                        </td>
                      )}
                      <td className="px-6 py-4 text-center">
                        <Skeleton className="h-4 w-12 mx-auto" /> {/* Actions */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : shipments.length === 0 ? (
          /* Empty State UI */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-primary dark:text-blue-400 opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Shipments Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
              You haven't created any shipments yet. Start by creating your
              first shipment invoice.
            </p>
            <Link
              to="/form"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-2xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Shipment
            </Link>
          </div>
        ) : (
          /* Table UI */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">AWB No.</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Phone Number</th>
                  <th className="px-6 py-3">Sender</th>
                  <th className="px-6 py-3">Receiver</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  {isOwnerMode && <th className="px-6 py-3 text-right">Cost</th>}
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {shipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {shipment.awb_no || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {shipment.shipment_date
                        ? format(
                          new Date(shipment.shipment_date),
                          "dd MMM yyyy",
                        )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {shipment.sender_contact || "N/A"}
                    </td>
                    <td className="px-6 py-4">{shipment.sender_name}</td>
                    <td className="px-6 py-4">{shipment.receiver_name}</td>
                    <td className="px-6 py-4">{shipment.destination}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${shipment.payment_type === 'Online'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800'
                        : 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-800'
                        }`}>
                        {shipment.payment_type || 'Cash'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                      ₹{(shipment.final_billing_amount ?? shipment.billing_amount ?? shipment.total_amount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {shipment.payment_status === 'Cancelled' ? (
                        <span className="px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 cursor-default flex items-center justify-center gap-1 w-fit mx-auto">
                          <Ban className="w-3 h-3" />
                          Cancelled
                        </span>
                      ) : (
                      <button
                        onClick={() => handleStatusToggle(shipment.id, shipment.payment_status as 'Paid' | 'Pending')}
                        disabled={togglingId === shipment.id}
                        className={`group relative px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 ${shipment.payment_status === 'Paid'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40'
                          : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                          }`}
                      >
                        {togglingId === shipment.id ? (
                          <div className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          shipment.payment_status || 'Pending'
                        )}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Click to toggle status
                        </div>
                      </button>
                      )}
                    </td>
                    {isOwnerMode && (
                      <td className="px-6 py-4 text-right font-medium text-gray-500 italic">
                        ₹{shipment.owner_cost?.toLocaleString() || 0}
                      </td>
                    )}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip text="View Details">
                          <Link
                            to={`/shipments/${shipment.id}`}
                            className="p-2 text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all active:scale-95"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Tooltip>

                        <Tooltip text="Edit Shipment">
                          <Link
                            to={`/form/${shipment.id}`}
                            className="p-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl transition-all active:scale-95"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Tooltip>

                        {shipment.payment_status !== 'Cancelled' && (
                        <Tooltip text="Cancel Shipment">
                          <button
                            onClick={() =>
                              handleCancelClick(shipment.id, shipment.awb_no)
                            }
                            className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all active:scale-95"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </Tooltip>
                        )}

                        {isAdminUser && (
                          <Tooltip text="Permanently Delete">
                            <button
                              onClick={() =>
                                handlePermanentDeleteClick(shipment.id, shipment.awb_no)
                              }
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all active:scale-95"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {shipments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing Page {page} of {totalPages} ({totalCount} results)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Shipment Confirmation Modal */}
      <Modal
        isOpen={cancelModal.isOpen}
        title="Cancel Shipment?"
        description={
          <div className="space-y-3">
            <p>
              Are you sure you want to cancel this shipment? The shipment will be marked as cancelled and excluded from billing calculations.
            </p>
            {cancelError && (
              <div className="p-2 bg-red-50 border border-red-100 text-red-600 font-bold rounded text-[11px] animate-pulse">
                {cancelError}
              </div>
            )}
          </div>
        }
        confirmLabel="Cancel Shipment"
        cancelLabel="Go Back"
        variant="danger"
        icon={XCircle}
        isConfirmLoading={isCancelling}
        onClose={() => {
          setCancelModal({ ...cancelModal, isOpen: false });
          setCancelError(null);
        }}
        onConfirm={handleConfirmCancel}
      />

      {/* Payment Status Confirmation Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        title="Update Payment Status?"
        description={
          <div className="space-y-3">
            <p>
              Are you sure you want to change the payment status to{" "}
              <span className={`font-bold ${statusModal.newStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                {statusModal.newStatus}
              </span>?
            </p>
          </div>
        }
        confirmLabel="Update Status"
        cancelLabel="Cancel"
        variant={statusModal.newStatus === 'Paid' ? 'primary' : 'warning'}
        icon={CreditCard}
        onClose={() => {
          setStatusModal({ ...statusModal, isOpen: false });
        }}
        onConfirm={handleConfirmStatusToggle}
      />

      {/* Permanent Delete Confirmation Modal (Admin Only) */}
      <Modal
        isOpen={permanentDeleteModal.isOpen}
        title="⚠️ Permanently Delete Shipment?"
        description={
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-bold text-sm">
                This action will permanently remove the shipment record from the database. This cannot be undone.
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Shipment <span className="font-bold text-gray-900">{permanentDeleteModal.awb || 'N/A'}</span> and its associated PDF will be permanently deleted.
            </p>
            {permanentDeleteError && (
              <div className="p-2 bg-red-50 border border-red-100 text-red-600 font-bold rounded text-[11px] animate-pulse">
                {permanentDeleteError}
              </div>
            )}
          </div>
        }
        confirmLabel="Permanently Delete"
        cancelLabel="Cancel"
        variant="danger"
        icon={Trash2}
        isConfirmLoading={isPermanentDeleting}
        onClose={() => {
          setPermanentDeleteModal({ ...permanentDeleteModal, isOpen: false });
          setPermanentDeleteError(null);
        }}
        onConfirm={handleConfirmPermanentDelete}
      />

      {/* Owner Mode Password Modal */}
      <Modal
        isOpen={ownerModal}
        title="Enter Owner Password"
        description={
          <div className="space-y-4">
            <p className="text-gray-500">
              Please enter the secondary owner password to access cost details.
            </p>
            <div>
              <input
                type="password"
                id="owner-mode-password"
                name="owner-mode-password"
                autoComplete="new-password"
                placeholder="Owner Password"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerifyOwner();
                }}
                autoFocus
              />
              {ownerError && (
                <p className="mt-2 text-xs text-red-600 font-medium animate-shake">
                  {ownerError}
                </p>
              )}
            </div>
          </div>
        }
        confirmLabel="Verify"
        cancelLabel="Cancel"
        isConfirmLoading={isVerifyingOwner}
        onClose={() => {
          setOwnerModal(false);
          setOwnerPassword("");
          setOwnerError(null);
        }}
        onConfirm={handleVerifyOwner}
      />
      {/* Export Modal */}
      <Modal
        isOpen={exportModal}
        onClose={() => setExportModal(false)}
        title="Export Shipments"
        description={
          <div className="space-y-4 text-left mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">Select a date range to export shipments. Leave blank to export all.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        }
        confirmLabel="Export to CSV"
        cancelLabel="Cancel"
        isConfirmLoading={isExporting}
        onConfirm={handleExport}
        icon={Download}
      />
    </div>
  );

  async function handleVerifyOwner() {
    setIsVerifyingOwner(true);
    setOwnerError(null);
    try {
      const response = await api.post("/auth/verify-owner", {
        password: ownerPassword,
      });
      if (response.data.success) {
        setOwnerMode(true);
        setOwnerModal(false);
        setOwnerPassword("");
      } else {
        setOwnerError("Invalid password. Please try again.");
      }
    } catch (err) {
      setOwnerError("Verification failed. Please check your password.");
    } finally {
      setIsVerifyingOwner(false);
    }
  }
};

export default Dashboard;
