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
  tagline?: string;
}

export const courierConfigs: Record<string, CourierConfig> = {
  shalibhadra: {
    name: "Shalibhadra",
    subName: "Couriers",
    displayName: "Shalibhadra Couriers",
    website: "https://shalibhadra-courier.vercel.app",
    address:
      "LOWER GROUND, SHOP NO LG-136, TURNING POINT COMPLEX,, OPP MAAKHAN BHOG, GHOD DOD ROAD, SURAT, Surat, Gujarat, 395007",
    footerText: "Shalibhadra Couriers , Surat",
    upiId: "bszaverizaveri-1@okhdfcbank",
    payeeName: "Shalibhadra Couriers",
    tagline: "Courier & Cargo",
    email: "shalibhadracourier1@gmail.com",
    contact: "9909408678",
  },
  navkar: {
    name: "NAVKAR",
    subName: "ENTERPRISE",
    displayName: "NAVKAR ENTERPRISE",
    website: "https://navkar-courier.vercel.app", // Placeholder, user can update
    address: "PLOT NO-118, THAKOR DWAR SOCIETY-3, HONEY PARK ROAD, ADAJAN, PALANPUR, SURAT, Surat, Gujarat, 395009", // Placeholder
    footerText: "NAVKAR ENTERPRISE , Surat",
    upiId: "bszaverizaveri-1@okhdfcbank", // Placeholder
    payeeName: "NAVKAR ENTERPRISE",
    tagline: "",
    email: "navakrenterprise1812@gmail.com",
    contact: "9909408678", // Placeholder
  },
};

// Get the brand from environment variable, default to 'shalibhadra'
export const brandKey = import.meta.env.VITE_APP_BRAND || "shalibhadra";

export const currentConfig = courierConfigs[brandKey] || courierConfigs["shalibhadra"];
