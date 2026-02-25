/** Lightweight shipment type used in listing/table views */
export interface Shipment {
  id: string;
  shipment_date: string;
  sender_name: string;
  receiver_name: string;
  destination: string;
  billing_amount: number;
  awb_no: string;
  tracking_url?: string | null;
}

/** Package item stored in the JSONB `packages` column */
export interface PackageItem {
  description: string;
  hsCode: string;
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

  // Sender
  sender_name: string;
  sender_address: string;
  sender_adhaar: string | null;
  sender_contact: string | null;
  sender_email: string | null;

  // Receiver
  receiver_name: string;
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
  total_amount: number | null;
  amount_in_words: string | null;
  billing_amount: number | null;
  tracking_url?: string | null;

  created_at: string;
}
