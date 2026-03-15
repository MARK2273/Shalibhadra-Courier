import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit2,
  Lock,
  Unlock,
} from "lucide-react";
import api, { deleteShipment } from "../api/api";
import Modal from "../components/ui/Modal";
import Tooltip from "../components/ui/Tooltip";
import { useOwnerMode } from "../context/OwnerModeContext";
import { format } from "date-fns";
import type { Shipment } from "../types/shipment";

// Simple Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const Dashboard: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
  }>({
    isOpen: false,
    id: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { isOwnerMode, setOwnerMode } = useOwnerMode();
  const [ownerModal, setOwnerModal] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [isVerifyingOwner, setIsVerifyingOwner] = useState(false);

  // Consolidated effect for fetching shipments
  React.useEffect(() => {
    // Debounce logic: Only delay if there's a search term
    const delay = search ? 500 : 0;

    const timer = setTimeout(() => {
      fetchShipments();
    }, delay);

    return () => clearTimeout(timer);
  }, [page, search]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/form/mydata?page=${page}&limit=10&search=${search}`,
      );
      setShipments(response.data.data);
      setTotalPages(response.data.meta.totalPages);
      setTotalCount(response.data.meta.total);
      setTotalRevenue(response.data.meta.totalRevenue);
      setInitialLoad(false);
    } catch (error) {
      console.error("Failed to fetch shipments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, _awb: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteShipment(deleteModal.id);
      // Refresh the list
      fetchShipments();
      setDeleteModal({ isOpen: false, id: "" });
    } catch (error) {
      console.error("Failed to delete shipment", error);
      setDeleteError("Failed to delete shipment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle search input change - reset page to 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={() => {
              if (isOwnerMode) {
                setOwnerMode(false);
              } else {
                setOwnerModal(true);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isOwnerMode
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && initialLoad
          ? // Skeleton for Stats
            Array(4)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl shadow-sm border border-gray-100 bg-white"
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
                color: "bg-white",
                text: "text-primary",
              },
              {
                label: "Total Revenue",
                value: `₹${totalRevenue.toLocaleString()}`,
                color: "bg-green-50",
                text: "text-green-600",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl shadow-sm border border-gray-100 ${stat.color}`}
              >
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className={`mt-2 text-3xl font-bold ${stat.text}`}>
                  {stat.value}
                </p>
              </div>
            ))}
      </div>

      {/* Recent Shipments Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Shipments
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              id="dashboard-search"
              name="dashboard-search"
              autoComplete="off"
              placeholder="Search shipments..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {loading ? (
          // Table Row Skeletons
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                <tr>
                  <th className="px-6 py-3">AWB No.</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Phone Number</th>
                  <th className="px-6 py-3">Sender</th>
                  <th className="px-6 py-3">Receiver</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Payment</th>
                  {isOwnerMode && <th className="px-6 py-3 text-right">Cost</th>}
                  <th className="px-6 py-3 text-right">Amount</th>
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
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Skeleton className="h-4 w-8 mx-auto" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : shipments.length === 0 ? (
          /* Empty State UI */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Shipments Found
            </h3>
            <p className="text-gray-500 max-w-sm mb-8">
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
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                <tr>
                  <th className="px-6 py-3">AWB No.</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Phone Number</th>
                  <th className="px-6 py-3">Sender</th>
                  <th className="px-6 py-3">Receiver</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Payment</th>
                  {isOwnerMode && <th className="px-6 py-3 text-right">Cost</th>}
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        shipment.payment_type === 'Online' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                          : 'bg-orange-50 text-orange-700 border border-orange-100'
                      }`}>
                        {shipment.payment_type || 'Cash'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      ₹{shipment.billing_amount}
                    </td>
                    {isOwnerMode && (
                      <td className="px-6 py-4 text-right font-medium text-green-600 bg-green-50/50">
                        ₹{shipment.owner_cost || 0}
                      </td>
                    )}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip text="View Details">
                          <Link
                            to={`/shipments/${shipment.id}`}
                            className="p-2 text-primary bg-blue-50 hover:bg-blue-100 rounded-xl transition-all active:scale-95"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Tooltip>

                        <Tooltip text="Edit Shipment">
                          <Link
                            to={`/form/${shipment.id}`}
                            className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all active:scale-95"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Tooltip>

                        <Tooltip text="Delete Shipment">
                          <button
                            onClick={() =>
                              handleDeleteClick(shipment.id, shipment.awb_no)
                            }
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all active:scale-95"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Tooltip>
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
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <span className="text-sm text-gray-500">
              Showing Page {page} of {totalPages} ({totalCount} results)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        title="Delete Shipment?"
        description={
          <div className="space-y-3">
            <p>
              Are you sure you want to delete this shipment? This action cannot
              be undone.
            </p>
            {deleteError && (
              <div className="p-2 bg-red-50 border border-red-100 text-red-600 font-bold rounded text-[11px] animate-pulse">
                {deleteError}
              </div>
            )}
          </div>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        icon={Trash2}
        isConfirmLoading={isDeleting}
        onClose={() => {
          setDeleteModal({ ...deleteModal, isOpen: false });
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
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
