"use client";

import { FormEvent, useState } from "react";

const repetitiveWork = [
  "chase enquiries",
  "update systems",
  "schedule appointments",
  "follow up customers",
  "process information",
  "move data between software",
];

const automationAreas = [
  ["Customer communication", "Respond to routine customer messages without leaving every reply to staff."],
  ["Lead follow-up", "Keep new enquiries moving when the team is busy or the first contact is missed."],
  ["Appointment workflows", "Automate reminders, confirmations and simple booking handoffs."],
  ["Admin automation", "Remove repetitive copying, checking, formatting and status updates."],
  ["CRM automation", "Keep records, stages and follow-ups updated from the work already happening."],
  ["Internal workflows", "Connect people, forms and software so work moves without manual chasing."],
  ["Custom software", "Build the missing tool when off-the-shelf software does not fit the operation."],
];

const workflowExamples = [
  {
    label: "Missed enquiries",
    problem: "A customer calls while staff are busy and nobody has time to follow up immediately.",
    system: "Detect the missed call and trigger a business-specific SMS with a clear next step.",
    outcome: "The enquiry is acknowledged quickly without adding another admin task.",
  },
  {
    label: "Appointment admin",
    problem: "Staff repeatedly confirm appointments, answer the same questions and chase no-responses.",
    system: "Automate reminders, confirmations and simple routing while keeping staff in control of exceptions.",
    outcome: "Less repetitive messaging and fewer manual follow-up steps.",
  },
  {
    label: "Data handoffs",
    problem: "Information is copied between forms, inboxes, spreadsheets and the CRM by hand.",
    system: "Capture the information once, validate it and push it into the right system automatically.",
    outcome: "Fewer handoff errors and less time spent moving data instead of using it.",
  },
];

const processSteps = [
  ["Find the bottleneck", "We identify the repetitive work, where it starts and what it is costing in time, speed or missed opportunities."],
  ["Design the workflow", "We define what should happen automatically, what still needs a person and how the system fits your existing tools."],
  ["Build the system", "The workflow is developed, connected and tested against real business scenarios."],
  ["Deploy into the business", "We put it live, document the handover and make sure the team knows where automation stops and human judgement starts."],
];

const trustedTechnology = [
  ["Twilio", "SMS & calls", "Missed-call follow-up, reminders and customer notifications."],
  ["OpenAI", "AI-assisted work", "Classifying enquiries, extracting information and drafting structured responses."],
  ["Vercel", "Web systems", "Fast delivery for customer-facing pages, portals and internal web tools."],
  ["Resend", "Email delivery", "Enquiry notifications, confirmations and transactional email."],
  ["Airtable", "Operations & CRM", "Lead records, workflow state, handoffs and simple operational databases."],
];

export default function Home() {
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  async function submitWorkflow(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("sending");
    setFormMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business: data.get("business"),
          email: data.get("email"),
          phone: data.get("phone"),
          details: data.get("details"),
          website: data.get("website"),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We couldn’t send your enquiry.");

      form.reset();
      setFormState("sent");
      setFormMessage("Thanks — Leverage Systems has your workflow. We’ll review it and get back to you within one business day.");
    } catch (error) {
      setFormState("error");
      setFormMessage(error instanceof Error ? error.message : "We couldn’t send your enquiry. Please try again.");
    }
  }

  const workflow = workflowExamples[activeWorkflow];

  return (
    <main>
      <header className="siteHeader">
        <a className="brand" href="#top" aria-label="Leverage Systems home">
          <img src="/brand/leverage-systems-logo.svg" alt="Leverage Systems" />
        </a>
        <a className="headerCta" href="#workflow-form">Discuss your workflow <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="heroCopy">
          <h1>Automate the work slowing your business down.</h1>
          <p className="heroLead">We identify repetitive work inside your operation and build systems that handle it automatically.</p>
          <p className="heroBenefit">Less admin. Faster follow-up. More time for work that actually grows the business.</p>
          <div className="heroActions">
            <a className="primary" href="#automate">See what we automate <span>↓</span></a>
            <a className="secondary" href="#workflow-form">Discuss your workflow <span>↗</span></a>
          </div>
        </div>

        <div className="heroSystem" aria-label="Example automation flow">
          <div className="systemTop">
            <span>BUSINESS WORKFLOW</span>
            <b>BEFORE → AFTER</b>
          </div>
          <div className="systemRow">
            <span className="systemIndex">01</span>
            <div><small>MANUAL</small><strong>Enquiry arrives</strong><p>Someone has to notice it.</p></div>
          </div>
          <div className="systemLine" />
          <div className="systemRow accent">
            <span className="systemIndex">02</span>
            <div><small>AUTOMATED</small><strong>System handles the routine steps</strong><p>Respond, update, route, remind.</p></div>
          </div>
          <div className="systemLine" />
          <div className="systemRow">
            <span className="systemIndex">03</span>
            <div><small>HUMAN</small><strong>Your team handles the valuable part</strong><p>Judgement, service and closing.</p></div>
          </div>
        </div>
      </section>

      <section className="problemBand">
        <div className="sectionLabel">THE PROBLEM</div>
        <div className="problemIntro">
          <h2>You’re paying people to repeat work software can handle.</h2>
          <p>Most automation opportunities are not dramatic. They are the small tasks repeated every day across calls, inboxes, calendars, CRMs and spreadsheets.</p>
        </div>
        <div className="taskGrid">
          {repetitiveWork.map((task) => <div key={task}><i aria-hidden="true" />{task}</div>)}
        </div>
      </section>

      <section className="section" id="automate">
        <div className="sectionHead">
          <div>
            <span className="sectionLabel">WHAT WE BUILD</span>
            <h2>Systems that remove repetitive work.</h2>
          </div>
          <p>Start with the task or bottleneck. We work out the simplest useful system around it.</p>
        </div>
        <div className="automationGrid">
          {automationAreas.map(([title, copy], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href="#workflow-form">Discuss this →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="workflowSection section" id="workflow-example">
        <div className="sectionHead">
          <div>
            <span className="sectionLabel">PROBLEM → WORKING SYSTEM</span>
            <h2>See how a bottleneck becomes a workflow.</h2>
          </div>
          <p>Choose a common use case. The goal is not to automate everything — only the repeatable steps that do not need human judgement.</p>
        </div>

        <div className="workflowTabs" role="tablist" aria-label="Automation examples">
          {workflowExamples.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={activeWorkflow === index}
              className={activeWorkflow === index ? "active" : ""}
              onClick={() => setActiveWorkflow(index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="workflowMap" role="tabpanel" aria-live="polite">
          <article>
            <small>01 / BOTTLENECK</small>
            <h3>The problem</h3>
            <p>{workflow.problem}</p>
          </article>
          <div className="workflowArrow">→</div>
          <article className="workflowCore">
            <small>02 / LEVERAGE SYSTEM</small>
            <h3>The automation</h3>
            <p>{workflow.system}</p>
          </article>
          <div className="workflowArrow">→</div>
          <article>
            <small>03 / RESULT</small>
            <h3>The outcome</h3>
            <p>{workflow.outcome}</p>
          </article>
        </div>
      </section>

      <section className="processSection section" id="process">
        <div className="sectionHead">
          <div>
            <span className="sectionLabel">HOW IT WORKS</span>
            <h2>From bottleneck to working system.</h2>
          </div>
          <p>A clear four-step build process keeps the project focused on the business problem rather than unnecessary software.</p>
        </div>
        <div className="processGrid">
          {processSteps.map(([title, copy], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="proofSection section" id="proof">
        <div className="sectionHead">
          <div>
            <span className="sectionLabel">PROOF &amp; DEMOS</span>
            <h2>Concrete examples, not vague automation claims.</h2>
          </div>
          <p>Capability demonstrations are labelled clearly. They show how a workflow can operate without pretending a concept is completed client work.</p>
        </div>

        <div className="proofGrid">
          <a className="featuredProof" href="/demo/gentle-dental-care">
            <div className="proofTag">TAILORED CONCEPT DEMO</div>
            <div>
              <small>GENTLE DENTAL CARE</small>
              <h3>Missed call → automatic SMS → booking path</h3>
              <p>A 40-second example of how a dental practice could follow up a missed caller automatically.</p>
            </div>
            <span>Watch demo ↗</span>
          </a>
          <article>
            <small>TYPICAL WORKFLOW</small>
            <h3>Lead response</h3>
            <p>Capture a new enquiry, acknowledge it, update the CRM and alert the right person without four separate admin steps.</p>
          </article>
          <article>
            <small>TYPICAL WORKFLOW</small>
            <h3>Admin handoff</h3>
            <p>Take information from a form or inbox, structure it and push it into the next system without manual copying.</p>
          </article>
        </div>
      </section>

      <section className="technologySection section">
        <div className="sectionHead">
          <div>
            <span className="sectionLabel">TRUSTED TECHNOLOGY</span>
            <h2>Built on proven platforms.</h2>
          </div>
          <p>These are technology platforms we build with, not claims of formal partnership or endorsement.</p>
        </div>
        <div className="technologyGrid">
          {trustedTechnology.map(([name, category, useCase]) => (
            <article key={name}>
              <div><strong>{name}</strong><span>{category}</span></div>
              <p>{useCase}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ctaBand">
        <div>
          <span className="sectionLabel">FOUND A BOTTLENECK?</span>
          <h2>Show us the work that takes too much time.</h2>
        </div>
        <a className="primary light" href="#workflow-form">Discuss your workflow <span>↗</span></a>
      </section>

      <section className="contactSection" id="contact">
        <div className="contactCopy">
          <span className="sectionLabel">DISCUSS YOUR WORKFLOW</span>
          <h2>What takes too much time in your business?</h2>
          <p>Describe the repetitive task, handoff or follow-up that keeps pulling people away from more valuable work. We’ll review it and tell you whether there is a practical automation opportunity.</p>
          <div className="contactDetails">
            <span>Leverage Systems</span>
            <span>Australia</span>
            <a href="mailto:hello@leveragesystems.tech">hello@leveragesystems.tech</a>
          </div>
        </div>

        <form id="workflow-form" onSubmit={submitWorkflow}>
          <div className="formRow">
            <label>Your name<input name="name" autoComplete="name" required /></label>
            <label>Business<input name="business" autoComplete="organization" required /></label>
          </div>
          <div className="formRow">
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            <label>Phone <small>optional</small><input name="phone" type="tel" autoComplete="tel" /></label>
          </div>
          <label>What takes too much time in your business?
            <textarea name="details" rows={6} placeholder="e.g. We miss enquiries while staff are busy, then someone has to follow up manually later." required />
          </label>
          <label className="hpField" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <button disabled={formState === "sending"}>
            {formState === "sending" ? "Sending…" : "Discuss my workflow"} <span>↗</span>
          </button>
          <p className="formNote">No quote request required. Start with the problem and we’ll work out whether automation makes sense.</p>
          {formMessage && <p className={`formStatus ${formState === "error" ? "error" : ""}`} role="status">{formMessage}</p>}
        </form>
      </section>

      <footer>
        <div className="footerBrand">
          <img src="/brand/leverage-systems-logo.svg" alt="Leverage Systems" />
          <p>Business automation systems built around real operational bottlenecks.</p>
        </div>
        <div className="footerLinks">
          <a href="/privacy">Privacy</a>
          <a href="mailto:hello@leveragesystems.tech">Contact</a>
          <a href="#top">Back to top ↑</a>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Leverage Systems. Australia.</p>
      </footer>
    </main>
  );
}
