"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const services = [
  ["01", "Websites that do a job", "Fast, polished sites designed to turn local searches and referrals into real enquiries."],
  ["02", "Business automation", "Remove repetitive admin with practical workflows tailored to the way your team already works."],
  ["03", "Custom software", "Quoting tools, client portals, booking systems and internal apps built around your business."],
];

const steps = [
  ["Discover", "We map the bottleneck and what success looks like."],
  ["Design", "You see the direction early, before the full build."],
  ["Build", "Your software is developed, tested and refined."],
  ["Launch", "We put it live and stay available after handover."],
];

const packages = [
  {
    name: "Website Launch",
    type: "DEFINED PROJECT RANGE",
    copy: "A focused business website with the scope agreed before development starts.",
    items: ["Defined page and feature scope", "Responsive build and launch", "Clear revision window"],
    note: "Hosting, domains and paid third-party services are quoted separately where required.",
  },
  {
    name: "Automation 100",
    type: "SETUP + MONTHLY RANGE",
    copy: "A packaged automation for one clear workflow, with predictable included usage.",
    items: ["Workflow setup and testing", "Up to 100 automated SMS/call actions per month", "Basic launch support"],
    note: "Included actions reset each monthly billing period and do not roll over. Extra usage is available in packaged add-on blocks.",
  },
  {
    name: "Custom Build",
    type: "SCOPED PROJECT RANGE",
    copy: "For portals, internal tools and software that needs a more tailored feature set.",
    items: ["Defined feature scope", "Build, testing and handover", "Direct developer access"],
    note: "The final range depends on integrations, workflow complexity and the number of custom features required.",
  },
];

export default function Home() {
  const [processStarted, setProcessStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const processRef = useRef<HTMLDivElement | null>(null);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    const node = processRef.current;
    if (!node || processStarted) return;

    if (typeof IntersectionObserver === "undefined") {
      setProcessStarted(true);
      return;
    }

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
    if (!processStarted) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [processStarted]);

  async function quote(e: FormEvent<HTMLFormElement>) {
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
          project: data.get("project"),
          details: data.get("details"),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We couldn’t send your enquiry.");

      form.reset();
      setFormState("sent");
      setFormMessage("Thanks — your enquiry has been sent. We’ll reply with practical next steps.");
    } catch (error) {
      setFormState("error");
      setFormMessage(error instanceof Error ? error.message : "We couldn’t send your enquiry. Please try again.");
    }
  }

  return (
    <main>
      <header>
        <a className="brand" href="#top"><b><i /><i /><i /></b><span>SYED<small>SOFTWARE</small></span></a>
        <nav><a href="#services">Services</a><a href="#process">Process</a><a className="navCta" href="#quote">Request a quote ↗</a></nav>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow"><i /> SOFTWARE FOR LOCAL BUSINESS</p>
          <h1>Your business has a <em>better way</em> to work.</h1>
          <p className="lead">Syed Software builds websites, automations and custom tools that save local businesses time—and help them win more customers.</p>
          <div className="actions"><a className="primary" href="#quote">Request a quote <span>↗</span></a><a href="#services">See what we build ↓</a></div>
          <div className="trust"><span>Built locally</span><span>Clear fixed scopes</span><span>Direct developer access</span></div>
        </div>
        <div className="board">
          <div className="boardTop"><span>BUSINESS.OS</span><span>● LIVE</span></div>
          <div className="card"><small>NEW LEAD</small><strong>Website enquiry</strong><i>Just now</i></div>
          <div className="line">···</div>
          <div className="card mid"><small>AUTOMATION</small><strong>Quote drafted</strong><i>Admin time saved</i></div>
          <div className="line">···</div>
          <div className="card end"><small>RESULT</small><strong>Job confirmed</strong><i>Customer notified</i></div>
          <div className="boardFoot"><small>ONE CONNECTED SYSTEM</small><strong>Less admin.<br />More business.</strong><b><i /><i /></b></div>
        </div>
      </section>

      <div className="ticker" aria-label="Services ticker">
        <div className="tickerTrack">
          <span>WEBSITES ✦ AUTOMATION ✦ CUSTOM SOFTWARE ✦ CLIENT PORTALS ✦ BOOKING SYSTEMS ✦</span>
          <span aria-hidden="true">WEBSITES ✦ AUTOMATION ✦ CUSTOM SOFTWARE ✦ CLIENT PORTALS ✦ BOOKING SYSTEMS ✦</span>
        </div>
      </div>

      <section className="services section" id="services">
        <div className="intro"><small>WHAT WE BUILD</small><h2>Useful software.<br /><em>Nothing you don’t need.</em></h2><p>No bloated platforms or vague tech talk. Just the right solution for the problem slowing your business down.</p></div>
        <div className="serviceList">{services.map(([n, t, p]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{p}</p></div><b>↗</b></article>)}</div>
      </section>

      <section className="packages section" id="packages">
        <div className="intro packageIntro"><small>PACKAGED OFFERS</small><h2>Clear scope.<br /><em>Flexible range.</em></h2><p>Packages make the conditions predictable without pretending every business needs the exact same build. Final pricing is confirmed inside a quoted range before work begins.</p></div>
        <div className="packageGrid">
          {packages.map((item, index) => (
            <article key={item.name}>
              <div className="packageTop"><span>0{index + 1}</span><small>{item.type}</small></div>
              <h3>{item.name}</h3>
              <p>{item.copy}</p>
              <ul>{item.items.map((point) => <li key={point}>{point}</li>)}</ul>
              <div className="packageCondition"><b>Conditions</b><p>{item.note}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="statement">
        <div><small>BUILT FOR THE REAL WORLD</small><h2>Software should fit your business.<br /><em>Not the other way around.</em></h2></div>
        <p>You know your business. We know how to turn the frustrating, manual parts into something faster, simpler and easier to grow.</p>
      </section>

      <section className="section process" id="process">
        <div className="intro"><small>HOW IT WORKS</small><h2>From problem to <em>working product.</em></h2></div>
        <div className={`processCarousel ${processStarted ? "isStarted" : ""}`} ref={processRef} aria-roledescription="carousel" aria-label="Syed Software process">
          <div className="processMeta"><span>PROCESS</span><b>0{activeStep + 1} / 04</b></div>
          <div className="processViewport">
            <div className="processTrack" style={{ transform: `translateX(-${activeStep * 100}%)` }}>
              {steps.map(([title, copy], index) => (
                <article className="processSlide" key={title} aria-hidden={activeStep !== index}>
                  <span>0{index + 1}</span>
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
          </div>
          <div className="processControls" aria-label="Process slides">
            {steps.map(([title], index) => (
              <button key={title} type="button" className={activeStep === index ? "active" : ""} onClick={() => setActiveStep(index)} aria-label={`Show ${title} step`}><span /></button>
            ))}
          </div>
        </div>
      </section>

      <section className="quote" id="quote">
        <div><small>START A PROJECT</small><h2>What could work <em>better</em> in your business?</h2><p>Tell us what you’re trying to improve. We’ll reply with practical next steps—not a hard sell.</p><div className="reply">↳ <b>Typically replies within 1 business day</b></div></div>
        <form onSubmit={quote}>
          <div className="row"><label>Your name<input name="name" placeholder="e.g. Sarah Nguyen" required /></label><label>Business name<input name="business" placeholder="Your business" required /></label></div>
          <label>Email address<input name="email" type="email" placeholder="you@business.com" required /></label>
          <label>What do you need?<select name="project" defaultValue="" required><option value="" disabled>Select a project type</option><option>Business website</option><option>Automation</option><option>Custom software</option><option>Not sure yet</option></select></label>
          <label>Tell us about the project<textarea name="details" rows={4} placeholder="What problem are you trying to solve?" required /></label>
          <button disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Request my quote"} <span>↗</span></button>
          {formMessage && <p className={`note ${formState === "error" ? "error" : ""}`} role="status">{formMessage}</p>}
        </form>
      </section>

      <footer><a className="brand" href="#top"><b><i /><i /><i /></b><span>SYED<small>SOFTWARE</small></span></a><p>Practical software for ambitious local businesses.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
