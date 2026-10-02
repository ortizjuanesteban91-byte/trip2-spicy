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
// REAL photos on Cloudinary (cloud o3hobtr4). Add a tour slug here with its Cloudinary public IDs (file names, no extension). First one is the cover.
const CL = "https://res.cloudinary.com/o3hobtr4/image/upload/f_auto,q_auto";
const GALLERY = {
  "saona-island": ["f64f3515-5222-4fda-9f67-3b068e13611c", "Saona_Eco_Adventure_21", "image00003", "eb95bc4e-d1f5-49cc-9c61-32560f221a88", "image00017", "Saona_Eco_Adventure_57", "image00016", "edc3ef5b-5850-4d61-b1e0-f22d724efd64", "eca0ab27-24b5-41c4-aa16-42dbb4b71331"],
};
const LOCAL = {
 "zipline-punta-cana": [
  "/tours/zipline-01.webp",
  "/tours/zipline-02.webp",
  "/tours/zipline-03.webp",
  "/tours/zipline-04.webp",
  "/tours/zipline-05.webp",
  "/tours/zipline-06.webp",
  "/tours/zipline-07.webp",
  "/tours/zipline-08.webp",
  "/tours/zipline-09.webp",
  "/tours/zipline-10.webp"
 ],
 "monkeyland": [
  "/tours/monkeyland-01.webp",
  "/tours/monkeyland-02.webp",
  "/tours/monkeyland-03.webp",
  "/tours/monkeyland-04.webp",
  "/tours/monkeyland-05.webp",
  "/tours/monkeyland-06.webp",
  "/tours/monkeyland-07.webp",
  "/tours/monkeyland-08.webp",
  "/tours/monkeyland-10.webp"
 ],
 "parasailing": [
  "/tours/parasail-04.webp",
  "/tours/parasail-05.webp",
  "/tours/parasail-01.webp",
  "/tours/parasail-02.webp",
  "/tours/parasail-03.webp",
  "/tours/parasail-06.webp",
  "/tours/parasail-07.webp",
  "/tours/parasail-08.webp",
  "/tours/parasail-09.webp",
  "/tours/parasail-10.webp"
 ],
 "santo-domingo": [
  "/tours/santo-07.webp",
  "/tours/santo-03.webp",
  "/tours/santo-09.webp",
  "/tours/santo-02.webp",
  "/tours/santo-08.webp",
  "/tours/santo-01.webp",
  "/tours/santo-10.webp",
  "/tours/santo-04.webp"
 ],
 "montana-redonda-miches": [
  "/tours/viewpoint-02.webp",
  "/tours/viewpoint-01.webp",
  "/tours/viewpoint-03.webp",
  "/tours/viewpoint-04.webp",
  "/tours/viewpoint-05.webp",
  "/tours/viewpoint-06.webp",
  "/tours/viewpoint-07.webp",
  "/tours/viewpoint-08.webp",
  "/tours/viewpoint-09.webp",
  "/tours/viewpoint-10.webp",
  "/tours/viewpoint-11.webp",
  "/tours/viewpoint-12.webp"
 ],
 "montana-redonda-from-punta-cana": [
  "/tours/viewpoint-02.webp",
  "/tours/viewpoint-01.webp",
  "/tours/viewpoint-03.webp",
  "/tours/viewpoint-04.webp",
  "/tours/viewpoint-05.webp",
  "/tours/viewpoint-06.webp",
  "/tours/viewpoint-07.webp",
  "/tours/viewpoint-08.webp",
  "/tours/viewpoint-09.webp",
  "/tours/viewpoint-10.webp",
  "/tours/viewpoint-11.webp",
  "/tours/viewpoint-12.webp"
 ],
 "atv-miches": [
  "/tours/miches-03.webp",
  "/tours/miches-08.webp",
  "/tours/miches-11.webp",
  "/tours/miches-07.webp",
  "/tours/miches-01.webp",
  "/tours/miches-04.webp",
  "/tours/miches-05.webp",
  "/tours/miches-06.webp",
  "/tours/miches-10.webp",
  "/tours/miches-12.webp"
 ],
 "montana-redonda-atv-miches": [
  "/tours/miches-03.webp",
  "/tours/miches-08.webp",
  "/tours/miches-11.webp",
  "/tours/miches-07.webp",
  "/tours/miches-01.webp",
  "/tours/miches-04.webp",
  "/tours/viewpoint-02.webp",
  "/tours/viewpoint-01.webp",
  "/tours/viewpoint-03.webp",
  "/tours/viewpoint-04.webp"
 ],
 "montana-redonda-atv-zipline-miches": [
  "/tours/miches-03.webp",
  "/tours/miches-08.webp",
  "/tours/miches-11.webp",
  "/tours/miches-07.webp",
  "/tours/miches-01.webp",
  "/tours/zipline-01.webp",
  "/tours/zipline-03.webp",
  "/tours/zipline-05.webp"
 ],
 "montana-redonda-atv-from-punta-cana": [
  "/tours/miches-03.webp",
  "/tours/miches-08.webp",
  "/tours/miches-11.webp",
  "/tours/miches-07.webp",
  "/tours/miches-01.webp",
  "/tours/miches-04.webp",
  "/tours/viewpoint-02.webp",
  "/tours/viewpoint-01.webp",
  "/tours/viewpoint-03.webp",
  "/tours/viewpoint-04.webp"
 ],
 "montana-redonda-atv-zipline-from-punta-cana": [
  "/tours/miches-03.webp",
  "/tours/miches-08.webp",
  "/tours/miches-11.webp",
  "/tours/miches-07.webp",
  "/tours/miches-01.webp",
  "/tours/zipline-01.webp",
  "/tours/zipline-03.webp",
  "/tours/zipline-05.webp"
 ],
 "horseback-riding-miches": [
  "/tours/horse-01.webp",
  "/tours/horse-02.webp",
  "/tours/horse-03.webp",
  "/tours/horse-04.webp",
  "/tours/horse-05.webp",
  "/tours/horse-06.webp",
  "/tours/horse-07.webp",
  "/tours/horse-08.webp",
  "/tours/horse-09.webp",
  "/tours/horse-10.webp",
  "/tours/horse-11.webp",
  "/tours/horse-12.webp"
 ],
 "horseback-riding-punta-cana": [
  "/tours/horse-01.webp",
  "/tours/horse-02.webp",
  "/tours/horse-03.webp",
  "/tours/horse-04.webp",
  "/tours/horse-05.webp",
  "/tours/horse-06.webp",
  "/tours/horse-07.webp",
  "/tours/horse-08.webp",
  "/tours/horse-09.webp",
  "/tours/horse-10.webp",
  "/tours/horse-11.webp",
  "/tours/horse-12.webp",
  "/tours/miches-02.webp",
  "/tours/miches-10.webp"
 ],
 "montana-redonda-horseback-riding-zipline-miches": [
  "/tours/horse-01.webp",
  "/tours/horse-02.webp",
  "/tours/horse-03.webp",
  "/tours/horse-04.webp",
  "/tours/horse-05.webp",
  "/tours/horse-06.webp",
  "/tours/zipline-01.webp",
  "/tours/zipline-03.webp",
  "/tours/zipline-05.webp"
 ],
 "speedboat": [
  "/tours/speed-08.webp",
  "/tours/speed-09.webp",
  "/tours/speed-10.webp",
  "/tours/speed-01.webp",
  "/tours/speed-03.webp",
  "/tours/speed-05.webp",
  "/tours/speed-04.webp",
  "/tours/speed-06.webp",
  "/tours/speed-07.webp",
  "/tours/speed-12.webp"
 ],
 "speedboat-parasailing-snorkeling": [
  "/tours/speed-08.webp",
  "/tours/speed-09.webp",
  "/tours/speed-10.webp",
  "/tours/speed-01.webp",
  "/tours/speed-03.webp",
  "/tours/parasail-04.webp",
  "/tours/parasail-05.webp",
  "/tours/parasail-01.webp"
 ],
 "buggy": [
  "/tours/bavaro-06.webp",
  "/tours/bavaro-09.webp",
  "/tours/bavaro-12.webp",
  "/tours/bavaro-08.webp",
  "/tours/bavaro-10.webp"
 ],
 "polaris-utv": [
  "/tours/bavaro-12.webp",
  "/tours/bavaro-09.webp",
  "/tours/bavaro-06.webp",
  "/tours/bavaro-08.webp",
  "/tours/bavaro-10.webp"
 ],
 "atv-punta-cana": [
  "/tours/bavaro-09.webp",
  "/tours/bavaro-12.webp",
  "/tours/bavaro-06.webp",
  "/tours/bavaro-08.webp",
  "/tours/bavaro-10.webp"
 ],
 "bavaro-runners": [
  "/tours/bavaro-06.webp",
  "/tours/bavaro-12.webp",
  "/tours/bavaro-09.webp",
  "/tours/bavaro-01.webp",
  "/tours/bavaro-11.webp",
  "/tours/bavaro-07.webp"
 ],
 "safari": [
  "/tours/bavaro-12.webp",
  "/tours/bavaro-09.webp",
  "/tours/bavaro-06.webp",
  "/tours/bavaro-02.webp",
  "/tours/bavaro-05.webp",
  "/tours/bavaro-08.webp",
  "/tours/bavaro-10.webp"
 ]
};
Object.assign(LOCAL, {
 "catalina-island": [
  "/tours/catalina-04.webp",
  "/tours/catalina-05.webp",
  "/tours/catalina-06.webp",
  "/tours/catalina-07.webp",
  "/tours/catalina-08.webp",
  "/tours/catalina-01.webp"
 ],
 "whale-watching-cayo-levantado": [
  "/tours/samana-02.webp",
  "/tours/samana-08.webp",
  "/tours/samana-06.webp",
  "/tours/samana-03.webp"
 ],
 "whale-watching-el-limon": [
  "/tours/samana-02.webp",
  "/tours/samana-06.webp",
  "/tours/samana-01.webp",
  "/tours/samana-08.webp"
 ],
 "whale-watching-half-day": [
  "/tours/samana-02.webp",
  "/tours/samana-08.webp",
  "/tours/samana-03.webp",
  "/tours/samana-05.webp"
 ],
 "el-limon-cayo-levantado": [
  "/tours/samana-01.webp",
  "/tours/samana-06.webp",
  "/tours/samana-08.webp",
  "/tours/samana-03.webp",
  "/tours/samana-05.webp",
  "/tours/samana-07.webp"
 ],
 "playa-rincon-cayo-levantado": [
  "/tours/samana-03.webp",
  "/tours/samana-08.webp",
  "/tours/samana-05.webp",
  "/tours/samana-02.webp"
 ],
 "best-beaches-samana": [
  "/tours/samana-03.webp",
  "/tours/samana-08.webp",
  "/tours/samana-05.webp",
  "/tours/samana-02.webp",
  "/tours/samana-04.webp"
 ]
});
const GALLERY_X = {
 "dolphin-explorer": [
  "dolphin-punta-cana-001",
  "dolphin-punta-cana-002",
  "dolphin-punta-cana-003",
  "dolphin-punta-cana-004",
  "dolphin-punta-cana-005",
  "dolphin-punta-cana-006",
  "dolphin-punta-cana-007",
  "dolphin-punta-cana-008",
  "dolphin-punta-cana-009",
  "dolphin-punta-cana-010",
  "dolphin-punta-cana-011",
  "dolphin-punta-cana-012",
  "dolphin-punta-cana-013",
  "dolphin-punta-cana-014",
  "dolphin-punta-cana-015"
 ],
 "deep-sea-fishing": [
  "09b4172e-22bc-4056-b3d0-10541b94e4f5",
  "55be8760-25e8-4479-a28c-aab6ab702b2e",
  "IMG-20210522-WA0082",
  "IMG-20210525-WA0217",
  "IMG-20210603-WA0086",
  "IMG-20210603-WA0105",
  "IMG-20210624-WA0121",
  "IMG-20210715-WA0145",
  "IMG-20210715-WA0152",
  "c3b3ae15-2f16-4d48-af4d-b500d5283a51",
  "34dade54-4f4a-46d2-a9a4-729ae48ea876",
  "e2d390f1-0984-4743-be0e-69845cc7c933"
 ],
 "catamaran-party-boat": [
  "image00010",
  "image00015",
  "image00020",
  "image00025",
  "image00030",
  "image00035",
  "image00040",
  "image00045",
  "image00050",
  "image00055",
  "image00060"
 ],
 "hip-hop-party-boat": [
  "image00018",
  "image00012",
  "image00030",
  "image00040",
  "image00050",
  "image00060"
 ],
 "coco-bongo": [
  "IMG_0406",
  "IMG_0407",
  "IMG_0408",
  "IMG_0409",
  "IMG_0410",
  "IMG_0421",
  "IMG_0423",
  "IMG_0425",
  "IMG_0427",
  "IMG_0430"
 ],
 "los-haitises": [
  "0001112",
  "DSC_6091",
  "DSC_6179",
  "DSC_6201",
  "AMS05361"
 ]
};
Object.assign(GALLERY, GALLERY_X);
const own = (slug, w) => LOCAL[slug] ? LOCAL[slug] : (GALLERY[slug] ? GALLERY[slug].map((id) => `${CL},w_${w}/${id}`) : null);
// Combo tours (no photos of their own) borrow photos from their parts, interleaved so every part shows up in the first four.
export const gallery = (slug, w = 1400) => {
  const g = own(slug, w); if (g) return g;
  const parts = (COMBO[slug] || []).map((s) => own(s, w)).filter(Boolean); if (!parts.length) return null;
  const out = []; for (let k = 0; out.length < 12 && parts.some((p) => k < p.length); k++) for (const p of parts) if (k < p.length && out.length < 12) out.push(p[k]);
  return out;
};
export const photo = (slug) => LOCAL[slug] ? LOCAL[slug][0] : (GALLERY[slug] ? `${CL},w_700,h_500,c_fill/${GALLERY[slug][0]}` : P[slug] ? B + P[slug] : null);

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
