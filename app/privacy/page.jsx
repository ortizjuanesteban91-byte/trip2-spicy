import { email, phone } from "@/data/site";
export const metadata = { title: "Privacy Policy | Trip2 Punta Cana", description: "How Trip2 Punta Cana collects, uses and protects your personal data." };
const H = ({ children }) => <h2 className="mt-9 text-xl font-black text-brand">{children}</h2>;
export default function Privacy() {
  return (
    <main>
      <section className="bg-brand px-5 py-14 text-center text-white"><h1 className="text-3xl font-black md:text-5xl">Privacy Policy</h1><p className="mx-auto mt-3 max-w-2xl text-white/85">Last updated October 2026.</p></section>
      <article className="mx-auto max-w-3xl space-y-3 px-5 py-10 text-[15px] leading-7 text-ink/85">
        <p>Trip2 LLC ("Trip2", "we") runs this site and the Trip2 Punta Cana booking service. This policy explains what we collect and why.</p>
        <H>What we collect</H>
        <p>Name, email, phone or WhatsApp number, hotel or pickup address, travel dates, number and type of guests, notes you write, and your messages in our chat assistant. We also collect basic technical data (device, pages visited, cookies) to run and improve the site.</p>
        <H>How we use it</H>
        <ul className="list-disc space-y-1.5 pl-6"><li>To process and confirm your booking, arrange pickup and contact you about your tour.</li><li>To answer questions and give support by WhatsApp, email or chat.</li><li>To keep records of your acceptance of our Terms &amp; Activity Waiver.</li><li>To prevent fraud, secure the site and improve our service.</li></ul>
        <H>Who we share it with</H>
        <p>Only what is needed: the partner operator who runs your tour (name, group size, hotel, pickup details), our payment provider Stripe, and service providers that host our site, store bookings, send email or power the chat assistant. We do not sell your personal data.</p>
        <H>Payments</H>
        <p>Card payments are handled by Stripe on its secure page. We never see or store your full card number. Please never type card details in the chat.</p>
        <H>Chat assistant</H>
        <p>Our chat assistant is an AI virtual assistant. Your conversation is saved in your browser for 24 hours so you can continue, and saved by us to give you service and improve answers.</p>
        <p>For the safety of our guests and team, the chat does not accept sexual, violent or threatening language. If a message like that is sent, we keep a safety record (the date and time, your IP address, browser details, the message and the conversation) and may block that person from using the chat. We keep these records only as long as needed to protect our service and, where necessary, to report abuse to the authorities.</p>
        <H>Cookies</H>
        <p>We use essential cookies and similar storage for the booking process, chat memory and affiliate links, and may use analytics to understand site usage. You can block cookies in your browser; some features may stop working.</p>
        <H>How long we keep it</H>
        <p>As long as needed for the booking, accounting and legal duties, then we delete or anonymise it.</p>
        <H>Your rights</H>
        <p>You can ask to see, correct or delete your personal data, or object to how we use it, by contacting us. We will answer within a reasonable time.</p>
        <H>Children</H>
        <p>Bookings must be made by an adult. We do not knowingly collect data from children.</p>
        <H>Contact</H>
        <p>Trip2 LLC · <a className="font-bold text-brand underline" href={`mailto:${email}`}>{email}</a> · {phone}. See also our <a className="font-bold text-brand underline" href="/terms">Terms &amp; Activity Waiver</a>.</p>
      </article>
    </main>
  );
}
