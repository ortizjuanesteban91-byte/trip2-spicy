// TEMP preview photos hotlinked from the live Trip2 site (look-only). Replace with real files before launch.
const B = "https://www.trip2puntacana.com/wp-content/uploads/";
const P = {
  "safari": "2025/02/safari-punta-cana-tour-011-700x500.jpg",
  "coco-bongo": "2025/02/MG_0181-700x500.webp",
  "montana-redonda-horseback-riding-miches": "2025/02/IMG_2254-700x500.jpeg",
  "catamaran-party-boat": "2026/04/Punta-Cana-catamaran-excursion-group-enjoying-open-bar-700x500.jpg",
  "catamaran-parasailing-snorkeling": "2025/02/Catamaran-Parasailing-Snorkeling-700x500.png",
  "hip-hop-party-boat": "2026/05/f4a99bdf-659d-453d-84ff-dd8f5a2966ed-700x500.jpg",
  "speedboat": "2025/02/GOPR6223-700x500.jpg",
  "speedboat-parasailing-snorkeling": "2025/02/Speedboat-Parasailing-Snorkeling-combo-tour-700x500.png",
  "parasailing": "2025/02/parasailing-punta-cana-001-700x500.jpg",
  "deep-sea-fishing": "2026/04/fishing-punta-cana-tour-071-700x500.jpg",
  "saona-island": "2025/02/saona-island-punta-cana-tour-009-700x500.jpg",
  "dolphin-explorer": "2025/02/dolphin-swim-punta-cana-tour-016-700x500.jpg",
  "atv-punta-cana": "2025/01/atv-punta-cana-tour-001--700x500.jpg",
  "buggy": "2025/02/buggy-punta-cana-tour-005-700x500.jpg",
  "polaris-utv": "2025/02/polaris-punta-cana-tour-001-700x500.jpg",
  "horseback-riding-punta-cana": "2026/04/horseback-riding-miches-109-700x500.jpg",
  "zipline-punta-cana": "2025/02/ziplines-punta-cana-008-1-700x500.jpg",
  "monkeyland": "2025/02/monkey-land-punta-cana-023-700x500.jpg",
  "monkeyland-zipline": "2025/02/monkey-land-punta-cana-012-700x500.jpg",
  "santo-domingo": "2025/02/santo-domingo-tour-025-700x500.jpg",
  "los-haitises": "2025/02/los-haitises-saman_78c0f10f-faf7-c98f-2af2791c4ee82427-700x500.jpg",
  "montana-redonda-from-punta-cana": "2025/02/montana-redonda014-700x500.jpg",
  "montana-redonda-atv-from-punta-cana": "2025/02/atv-tour-miches-039-700x500.jpg",
  "montana-redonda-atv-zipline-from-punta-cana": "2025/02/montana-redonda107-700x500.jpg",
  "atv-miches": "2025/02/atv-tour-miches-165-700x500.jpg",
  "montana-redonda-atv-miches": "2025/02/IMG_5887-700x500.jpeg",
  "montana-redonda-atv-zipline-miches": "2025/02/montana-redonda044-700x500.jpg",
  "horseback-riding-miches": "2026/04/horseback-riding-miches-026-700x500.jpg",
  "montana-redonda-miches": "2025/02/montana-redonda081-700x500.jpg",
  "montana-redonda-horseback-riding-zipline-miches": "2025/02/ff0575ab-071a-4c9d-8f11-ef155b499f6d-700x500.jpg",
  "buggy-monkeyland": "2025/02/buggy-punta-cana-tour-005-700x500.jpg",
  "buggy-zipline": "2025/02/ziplines-punta-cana-008-1-700x500.jpg",
  "triple-adventure": "2025/01/atv-punta-cana-tour-001--700x500.jpg",
  "bavaro-runners": "2025/02/safari-punta-cana-tour-011-700x500.jpg",
};
// Home page header picture (TEMPORARY, change here or send the final photo).
export const HERO = "catamaran-party-boat";
export const photo = (slug) => (P[slug] ? B + P[slug] : null);

// Combo tours show a strip of photos (one per part of the combo), like the Speedboat combo. Each panel uses the photo of that tour,
// so when real photos are uploaded the strip updates by itself.
const COMBO = {
  "catamaran-parasailing-snorkeling": ["catamaran-party-boat", "parasailing"],
  "monkeyland-zipline": ["monkeyland", "zipline-punta-cana"],
  "buggy-monkeyland": ["buggy", "monkeyland"],
  "buggy-zipline": ["buggy", "zipline-punta-cana"],
  "triple-adventure": ["buggy", "zipline-punta-cana", "monkeyland"],
  "montana-redonda-atv-from-punta-cana": ["montana-redonda-from-punta-cana", "atv-punta-cana"],
  "montana-redonda-atv-zipline-from-punta-cana": ["montana-redonda-from-punta-cana", "atv-punta-cana", "zipline-punta-cana"],
  "montana-redonda-atv-miches": ["montana-redonda-miches", "atv-miches"],
  "montana-redonda-atv-zipline-miches": ["montana-redonda-miches", "atv-miches", "zipline-punta-cana"],
  "montana-redonda-horseback-riding-miches": ["montana-redonda-miches", "horseback-riding-miches"],
  "montana-redonda-horseback-riding-zipline-miches": ["montana-redonda-miches", "horseback-riding-miches", "zipline-punta-cana"],
};
export const strip = (slug) => { const u = (COMBO[slug] || []).map(photo).filter(Boolean); return u.length >= 2 ? u : null; };
