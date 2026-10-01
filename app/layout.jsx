import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export const metadata = { title: "Trip2 Spicy | Punta Cana VIP Excursions", description: "Official Punta Cana VIP excursions, island adventures and authentic Dominican experiences.", robots: { index: false, follow: false } };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body><Header />{children}<Footer /></body>
    </html>
  );
}
