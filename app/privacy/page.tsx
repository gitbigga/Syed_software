import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for Leverage Systems.",
};

export default function PrivacyPage() {
  return (
    <main className="legalPage">
      <header className="legalHeader">
        <a href="/" aria-label="Leverage Systems home">
          <img src="/brand/leverage-systems-logo.svg" alt="Leverage Systems" />
        </a>
        <a href="/">Back to website ↑</a>
      </header>

      <article className="legalContent">
        <span className="sectionLabel">PRIVACY</span>
        <h1>Privacy Policy</h1>
        <p>Leverage Systems collects only the information needed to respond to enquiries, assess automation opportunities and deliver agreed services.</p>

        <h2>Information we collect</h2>
        <p>When you submit the website form, we may collect your name, business name, email address, optional phone number and the workflow or business problem you describe.</p>

        <h2>How we use it</h2>
        <ul>
          <li>to respond to your enquiry;</li>
          <li>to assess and discuss a potential project;</li>
          <li>to keep a record of the business relationship and communication history;</li>
          <li>to stop automated prospecting when you contact us directly; and</li>
          <li>to operate, secure and improve our website and business systems.</li>
        </ul>

        <h2>Service providers</h2>
        <p>We use service providers to operate parts of our business systems. Website enquiries may be processed through Vercel, Resend and Airtable. These providers process information according to their own privacy and security terms.</p>

        <h2>Outbound contact</h2>
        <p>If your business has previously appeared in our prospecting system and you submit an inbound website enquiry, we mark that company as inbound and pause automated outbound prospecting so that communication can continue in the context of your enquiry.</p>

        <h2>Storage and access</h2>
        <p>We take reasonable steps to limit access to business and contact information to the systems and people required to handle the enquiry or service. We do not sell website-enquiry information.</p>

        <h2>Your choices</h2>
        <p>You can ask us to correct or remove information we hold about your website enquiry, subject to any legal or operational record-keeping requirements.</p>

        <h2>Contact</h2>
        <p>For privacy questions, email <a href="mailto:hello@leveragesystems.tech">hello@leveragesystems.tech</a>.</p>

        <p><strong>Leverage Systems — Australia</strong></p>
      </article>
    </main>
  );
}
