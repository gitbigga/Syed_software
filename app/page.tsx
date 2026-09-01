"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const repetitiveWork = [
  "chase enquiries",
  "schedule appointments",
  "follow up customers",
];

const automationAreas = [
  ["Lead follow-up", "Keep new enquiries moving when the team is busy or the first contact is missed."],
  ["Appointment workflows", "Automate reminders, confirmations and simple booking handoffs."],
  ["Customer communication", "Respond to routine customer messages without leaving every reply to staff."],
  ["Admin automation", "Remove repetitive copying, checking, formatting and status updates."],
];

const processSteps = [
  ["Find the bottleneck", "We identify the repetitive work, where it starts and what it is costing in time, speed or missed opportunities."],
  ["Design the workflow", "We define what should happen automatically, what still needs a person and how the system fits your existing tools."],
  ["Build the system", "The workflow is developed, connected and tested against real business scenarios."],
  ["Deploy into the business", "We put it live, document the handover and make sure the team knows where automation stops and human judgement starts."],
];

export default function Home() {
  const [activeProcess, setActiveProcess] = useState(0);
  const [processStarted, setProcessStarted] = useState(false);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");
  const processRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = processRef.current;
    if (!node || processStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProcessStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [processStarted]);

  useEffect(() => {
    if (!processStarted || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveProcess((current) => (current + 1) % processSteps.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [processStarted]);

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

      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error || "We couldn’t send your enquiry.");

      form.reset();
      setFormState("sent");
      setFormMessage("Thanks — Leverage Systems has your workflow. We’ll review it and get back to you within one business day.");
    } catch (error) {
      setFormState("error");
      setFormMessage(error instanceof Error ? error.message : "We couldn’t send your enquiry. Please try again.");
    }
  }


  return (
    <main>
      <header className="siteHeader">
        <a className="brand" href="#top" aria-label="Leverage Systems home">
          <img src="/brand/leverage-systems-logo.svg" alt="Leverage Systems" />
        </a>
        <a className="headerCta" href="#workflow-form">Get time back <span>↗</span></a>
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
          <p>The highest-value automations are usually simple, repeated tasks that pull staff away from customers and higher-value work.</p>
        </div>
        <div className="taskGrid compactTasks">
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
        <div className="automationGrid compactAutomation">
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

      <section className="processSection section" id="process" ref={processRef}>
        <div className="sectionHead processIntro">
          <div>
            <span className="sectionLabel">HOW IT WORKS</span>
            <h2>From bottleneck to working system.</h2>
          </div>
          <p>A focused four-step process keeps the build centred on the business problem instead of unnecessary software.</p>
        </div>

        <div className="processCarousel" aria-roledescription="carousel" aria-label="Leverage Systems process">
          <div className="processMeta">
            <span>PROCESS</span>
            <b>0{activeProcess + 1} / 04</b>
          </div>
          <div className="processViewport">
            <div className="processTrack" style={{ transform: `translateX(-${activeProcess * 100}%)` }}>
              {processSteps.map(([title, copy], index) => (
                <article className="processSlide" key={title} aria-hidden={activeProcess !== index}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="processNavigation" aria-label="Process navigation">
            <button
              className="processArrow"
              type="button"
              aria-label="Previous process step"
              onClick={() => setActiveProcess((activeProcess - 1 + processSteps.length) % processSteps.length)}
            >
              ◀
            </button>
            <div className="processControls" aria-label="Process slides">
              {processSteps.map(([title], index) => (
                <button
                  type="button"
                  key={title}
                  className={activeProcess === index ? "active" : ""}
                  aria-label={`Show ${title} step`}
                  onClick={() => setActiveProcess(index)}
                >
                  <span />
                </button>
              ))}
            </div>
            <button
              className="processArrow"
              type="button"
              aria-label="Next process step"
              onClick={() => setActiveProcess((activeProcess + 1) % processSteps.length)}
            >
              ▶
            </button>
          </div>
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

        <div className="footerIndex">
          <div>
            <span className="footerHeading">PAGE INDEX</span>
            <a href="#top">Home</a>
            <a href="#automate">What we build</a>
            <a href="#process">How it works</a>
            <a href="#proof">Proof &amp; demos</a>
            <a href="#workflow-form">Discuss your workflow</a>
            <a href="/privacy">Privacy</a>
          </div>
          <div>
            <span className="footerHeading">CONTACT</span>
            <a href="mailto:hello@leveragesystems.tech">hello@leveragesystems.tech</a>
          </div>
        </div>

        <p className="copyright">© {new Date().getFullYear()} Leverage Systems. Australia.</p>
      </footer>
    </main>
  );
}
