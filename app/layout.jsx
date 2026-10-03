import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chrome from "@/components/Chrome";
import AosInit from "@/components/AosInit";
import { robotsMeta, agencySchema, SITE, OG_IMAGE } from "@/lib/site";
export const metadata = { metadataBase: new URL(SITE), title: "Trip2 Punta Cana | VIP Excursions", description: "Official Punta Cana VIP excursions, island adventures and authentic Dominican experiences.", robots: robotsMeta, openGraph: { type: "website", siteName: "Trip2 Punta Cana", locale: "en_US", url: "/", title: "Trip2 Punta Cana | VIP Excursions", description: "Official Punta Cana VIP excursions, island adventures and authentic Dominican experiences.", images: [OG_IMAGE] }, twitter: { card: "summary_large_image", title: "Trip2 Punta Cana | VIP Excursions", description: "Official Punta Cana VIP excursions, island adventures and authentic Dominican experiences.", images: [OG_IMAGE.url] } };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(agencySchema) }} /><AosInit /><Chrome top={<Header />} bottom={<Footer />}>{children}</Chrome></body>
    </html>
  );
}
