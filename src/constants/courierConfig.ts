export interface CourierConfig {
  name: string;
  subName: string;
  displayName: string;
  website: string;
  address: string; // The fixed address from the PDF
  contact?: string; // Optional global contact
  email?: string; // Optional global email
  logoText?: string; // If Logo is text based
  logoImage?: string; // If we want to support image logos later
  footerText?: string;
  upiId?: string;
  payeeName?: string;
}

export const courierConfigs: Record<string, CourierConfig> = {
  shalibhadra: {
    name: "Shalibhadra",
    subName: "Couriers",
    displayName: "Shalibhadra Couriers",
    website: "https://shalibhadra-courier.vercel.app",
    address:
      "UG-418 TURNING POINT COMPLEX NEAR MAAKHAN BHOG GHOD DOD SURAT-395007",
      footerText: "Shalibhadra Couriers , Surat",
      upiId: "bszaverizaveri-1@okhdfcbank",
      payeeName: "Shalibhadra Couriers",
  },
  navkar: {
    name: "Navkar",
    subName: "Couriers", // Assuming similarity
    displayName: "Navkar Couriers",
    website: "https://navkar-courier.vercel.app", // Placeholder, user can update
    address: "SHOP NO 12, NAKSHATRA HEIGHTS, NEAR MADHUVAN CIRCLE, ADAJAN, SURAT-395009", // Placeholder
    footerText: "Navkar Couriers , Surat",
    upiId: "bszaverizaveri-1@okhdfcbank", // Placeholder
    payeeName: "Navkar Couriers",
  },
};

// Get the brand from environment variable, default to 'shalibhadra'
export const brandKey = import.meta.env.VITE_APP_BRAND || "shalibhadra";

export const currentConfig = courierConfigs[brandKey] || courierConfigs["shalibhadra"];
