import LeadForm from "@/components/LeadForm";
export const metadata = { title: "Contact Us | Trip2 Spicy" };
export default function Contact() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="mb-6 text-4xl font-black text-brand">Contact Us</h1>
      <LeadForm kind="contact" intro="Tell us what you'd like to do in Punta Cana and we will reply on WhatsApp or email." fields={[{ name: "message", label: "Message", type: "textarea", required: true }]} />
    </main>
  );
}
