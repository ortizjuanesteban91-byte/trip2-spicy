// Airport transfer setup. Edit prices here (USD, ONE WAY, per vehicle). Leave a price as null and the page says "we confirm your price on WhatsApp".
export const VEHICLES = [
  { id: "suv", name: "Private SUV", seats: "1–5 guests", bags: "5 bags", prices: { bavaro: null, uvero: null, other: null } },
  { id: "van", name: "Private Van", seats: "6–10 guests", bags: "10 bags", prices: { bavaro: null, uvero: null, other: null } },
  { id: "minibus", name: "Mini Bus", seats: "11–20 guests", bags: "20 bags", prices: { bavaro: null, uvero: null, other: null } },
  { id: "bus", name: "Bus", seats: "21–59 guests", bags: "Group luggage", prices: { bavaro: null, uvero: null, other: null } },
];
export const ZONES = [["bavaro", "Bávaro / Punta Cana / Cap Cana"], ["uvero", "Uvero Alto / Macao"], ["other", "Other hotel or Airbnb address"]];
