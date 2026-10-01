import LeadForm from "@/components/LeadForm";
import { getTour } from "@/lib/tours";
export const metadata = { title: "Contact Us | Trip2 Punta Cana" };
export default async function Contact({ searchParams }) {
  const { tour } = await searchParams;
  const t = tour ? await getTour(String(tour).slice(0, 120)) : null;
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="mb-6 text-4xl font-black text-brand">Contact Us</h1>
      <LeadForm kind={t ? "enquiry" : "contact"} intro={t ? `Your question about: ${t.name}` : "Tell us what you'd like to do in Punta Cana and we will reply on WhatsApp or email."} fields={[...(t ? [{ name: "Tour", label: "Tour", type: "text", defaultValue: t.name }] : []), { name: "message", label: "Message", type: "textarea", required: true }]} />
    </main>
  );
}
