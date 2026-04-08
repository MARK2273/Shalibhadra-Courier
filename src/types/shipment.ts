/** Lightweight shipment type used in listing/table views */
export interface Shipment {
  id: string;
  shipment_date: string;
  sender_name: string;
  receiver_name: string;
  destination: string;
  billing_amount: number;
  total_amount?: number;
  final_billing_amount?: number | null;
  awb_no: string;
  sender_contact?: string | null;
  payment_type: 'Cash' | 'Online';
  selected_upi_id?: string | null;
  payment_status: 'Paid' | 'Pending';
  tracking_url?: string | null;
  owner_cost?: number;
  utr_number?: string | null;
}

export interface UpiConfig {
  id: string;
  tenant_id: string;
  display_name: string;
  upi_id: string;
  payee_name: string;
  is_active: boolean;
  created_at: string;
}

/** Package item stored in the JSONB `packages` column */
export interface PackageItem {
  description: string;
  hsnCode: string;
  quantity: number;
  rate: number;
  amount: number;
  boxNo: string;
  [key: string]: string | number;
}

/** Full shipment detail as returned by GET /api/form/:id */
export interface ShipmentDetail {
  id: string;
  user_id: string;
  tenant_id: string;

  // Header
  service: string | null;
  awb_no: string | null;
  origin: string;
  destination: string;
  invoice_number: string | null;
  invoice_date: string | null;
  shipment_date: string | null;
  service_details: string | null;
  box_count: number;
  shipment_type: 'Docs' | 'Non-Docs';

  // Sender
  sender_name: string;
  sender_company: string | null;
  sender_address: string;
  sender_adhaar: string | null;
  sender_contact: string | null;
  sender_email: string | null;

  // Receiver
  receiver_name: string;
  receiver_company: string | null;
  receiver_address: string;
  receiver_contact: string | null;
  receiver_email: string | null;

  // Routing
  port_of_loading: string | null;

  // Items
  packages: PackageItem[];

  // Financials
  pcs: number | null;
  weight: string | null;
  volumetric_weight: string | null;
  currency: string | null;
  item_currency: string | null;
  total_amount: number | null;
  amount_in_words: string | null;
  billing_amount: number | null;
  final_billing_amount?: number | null;
  payment_type: 'Cash' | 'Online';
  selected_upi_id: string | null;
  payment_status: 'Paid' | 'Pending';
  upi_details?: {
    upi_id: string;
    payee_name: string;
    display_name: string;
  } | null;
  tracking_url?: string | null;

  owner_cost?: number;
  utr_number?: string | null;
  created_at: string;
}
