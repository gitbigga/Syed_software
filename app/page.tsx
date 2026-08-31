"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

const services = [
  {
    number: "01",
    title: "Bring in more enquiries",
    copy: "A sharper website that makes it easier for local customers to understand what you do and take the next step.",
    href: "#package-website",
    cta: "See website package",
  },
  {
    number: "02",
    title: "Follow up leads automatically",
    copy: "Turn missed calls, enquiries and repetitive follow-up into a simple automated workflow.",
    href: "/demo/gentle-dental-care",
    cta: "See a live concept",
  },
  {
    number: "03",
    title: "Cut repetitive admin",
    copy: "Replace manual quoting, booking, data entry or handoffs with a tool built around the way your business works.",
    href: "#package-custom",
    cta: "See custom build",
  },
];

const steps = [
  ["Discover", "We identify the bottleneck, the cost of leaving it alone and what a better outcome should look like."],
  ["Design", "You see the direction early, before the full build starts."],
  ["Build", "Your website, automation or software is developed, tested and refined."],
  ["Launch", "We put it live, hand it over clearly and stay available for the agreed launch support."],
];

const problems = [
  ["Missed enquiries", "Customers call or message, but busy staff cannot always respond while the opportunity is still warm."],
  ["Too much repetitive admin", "Time disappears into copying information, sending the same messages and updating systems by hand."],
  ["An outdated website", "The business looks better in real life than it does online, costing trust before a customer even calls."],
  ["Software that does not fit", "Generic platforms force the team into somebody else’s workflow instead of supporting the one that already works."],
];

const packages = [
  {
    id: "package-website",
    name: "Business Website",
    outcome: "Turn searches and referrals into more enquiries.",
    type: "ONE-OFF PROJECT",
    price: "AUD $1,500–$4,000",
    copy: "For local businesses that need a fast, credible website designed around one clear conversion goal.",
    items: ["Defined page and feature scope", "Responsive build and launch", "Clear revision window"],
  },
  {
    id: "package-followup",
    name: "Lead Follow-Up System",
    outcome: "Respond faster without adding more admin.",
    type: "SETUP + MONTHLY",
    price: "AUD $1,000–$3,000 setup",
    subprice: "Typical ongoing range: $150–$500 / month",
    copy: "For one clear workflow such as missed-call SMS follow-up, lead nurturing or appointment reminders.",
    items: ["Workflow setup and testing", "Usage allowance defined in your quote", "Add-on usage available in fixed blocks"],
  },
  {
    id: "package-custom",
    name: "Business Workflow System",
    outcome: "Replace repetitive work with a system built around your team.",
    type: "SCOPED PROJECT",
    price: "AUD $3,000–$10,000+",
    copy: "For portals, quoting tools, internal apps and workflows that need a more tailored feature set.",
    items: ["Defined feature scope", "Build, testing and handover", "Direct developer access"],
  },
];

const tickerItems = ["MORE ENQUIRIES", "LESS ADMIN", "FASTER FOLLOW-UP", "CLEAR SCOPES", "DIRECT DEVELOPER ACCESS"];

const trustedPlatforms = [
  { name: "Twilio", category: "SMS & calls", useCase: "Missed-call follow-up, reminders and customer notifications." },
  { name: "OpenAI", category: "AI-assisted workflows", useCase: "Classify enquiries, draft responses and summarise handoffs." },
  { name: "Vercel", category: "Web delivery", useCase: "Fast hosting and reliable deployment for websites and web apps." },
  { name: "Resend", category: "Email delivery", useCase: "Quote confirmations, alerts and transactional email." },
];

const faqs = [
  ["How much does a project cost?", "The package ranges above are indicative. Final pricing is confirmed before work begins, after the exact scope and integrations are clear."],
  ["Do I need to know what software I need?", "No. Start with the problem. Tell us what is taking too long, getting missed or costing opportunities, and we can recommend the simplest useful approach."],
  ["Do I need to replace the tools I already use?", "Not necessarily. Where practical, the solution can be designed around tools your business already uses rather than forcing a full replacement."],
  ["What happens after I enquire?", "We review the problem, clarify anything important and send back a recommended approach with an indicative scope. Nothing starts until you approve the final scope and price."],
  ["What happens after launch?", "Every project includes an agreed handover and launch-support window. Ongoing support can be scoped separately when it is useful."],
];

export default function Home() {
  const [processStarted, setProcessStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [processReset, setProcessReset] = useState(0);
  const processRef = useRef<HTMLDivElement | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  const setStepManually = (index: number) => {
    setActiveStep((index + steps.length) % steps.length);
    setProcessReset((value) => value + 1);
  };

  const previousStep = () => setStepManually(activeStep - 1);
  const nextStep = () => setStepManually(activeStep + 1);

  function beginSwipe(event: ReactPointerEvent<HTMLDivElement>) {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  }

  function endSwipe(event: ReactPointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return;

    if (dx < 0) nextStep();
    else previousStep();
  }

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

    const timer = window.setTimeout(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [processStarted, activeStep, processReset]);

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
          email: data.get("email"),
          details: data.get("details"),
          business: "",
          project: "Not sure yet",
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
        <a className="navCta" href="#quote-form">Get a scope &amp; price ↗</a>
      </header>

      <section className="hero" id="top">
        <div className="heroCopy">
          <h1>More sales.<br /><em>Less admin.</em><br />More time back.</h1>
          <p className="lead">Websites and automations designed to help local businesses bring in more enquiries, follow them up faster and cut repetitive work.</p>
          <div className="actions"><a className="primary" href="#quote-form">Get a scope &amp; price <span>↗</span></a></div>
        </div>

        <div className="heroProcess" id="process">
          <div className="intro heroProcessIntro"><small>HOW IT WORKS</small><h2>From problem to <em>working product.</em></h2></div>
          <div
            className={`processCarousel ${processStarted ? "isStarted" : ""}`}
            ref={processRef}
            aria-roledescription="carousel"
            aria-label="Syed Software process"
            onPointerDown={beginSwipe}
            onPointerUp={endSwipe}
            onPointerCancel={() => { swipeStart.current = null; }}
          >
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
            <div className="processNavigation" aria-label="Process navigation">
              <button className="processArrow" type="button" onClick={previousStep} aria-label="Previous process step">◀</button>
              <div className="processControls" key={`${activeStep}-${processReset}`} aria-label="Process slides">
                {steps.map(([title], index) => (
                  <button key={title} type="button" className={activeStep === index ? "active" : ""} onClick={() => setStepManually(index)} aria-label={`Show ${title} step`}><span /></button>
                ))}
              </div>
              <button className="processArrow" type="button" onClick={nextStep} aria-label="Next process step">▶</button>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-label="Benefits ticker">
        <div className="tickerTrack">
          <div className="tickerGroup">
            {tickerItems.map((item) => <span className="tickerItem" key={item}>{item}<i aria-hidden="true">✦</i></span>)}
          </div>
          <div className="tickerGroup" aria-hidden="true">
            {tickerItems.map((item) => <span className="tickerItem" key={`copy-${item}`}>{item}<i>✦</i></span>)}
          </div>
        </div>
      </div>

      <section className="problems section" id="problems">
        <div className="intro"><small>PROBLEMS WE SOLVE</small><h2>Where time and money <em>leak out.</em></h2><p>You do not need to know the technical answer first. Start with the part of the business that is slow, repetitive or losing opportunities.</p></div>
        <div className="problemGrid">
          {problems.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="services section" id="services">
        <div className="intro"><small>WHAT WE BUILD</small><h2>Choose the <em>result.</em><br />We’ll work out the software.</h2><p>The goal is not to add more technology. It is to remove friction and create a clearer path to revenue or time saved.</p></div>
        <div className="serviceList">
          {services.map((service) => (
            <a href={service.href} key={service.number}>
              <span>{service.number}</span>
              <div><h3>{service.title}</h3><p>{service.copy}</p><small>{service.cta} →</small></div>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>

      <section className="demo section" id="demo">
        <div className="demoVisual" aria-hidden="true">
          <div className="demoBadge">CONCEPT DEMO</div>
          <div className="demoFlow">
            <div><span>01</span><strong>Missed call</strong><small>Patient cannot get through</small></div>
            <i>→</i>
            <div><span>02</span><strong>SMS sent</strong><small>Follow-up happens automatically</small></div>
            <i>→</i>
            <div><span>03</span><strong>Booking path</strong><small>Conversation continues</small></div>
          </div>
        </div>
        <div className="intro demoCopy"><small>SEE IT WORKING</small><h2>Understand the automation in <em>40 seconds.</em></h2><p>This concept was prepared for Gentle Dental Care to show how a missed call can trigger an immediate SMS follow-up and give the patient an easier path back toward booking.</p><p className="disclosure">Concept demonstration only — not presented as a customer case study.</p><a className="primary" href="/demo/gentle-dental-care">Watch the demo <span>↗</span></a></div>
      </section>

      <section className="platforms section" id="platforms">
        <div className="intro platformIntro">
          <small>TRUSTED PLATFORMS</small>
          <h2>Built with tools businesses <em>already trust.</em></h2>
          <p>We use proven platforms for communications, AI, hosting and email, then tailor the workflow around your business.</p>
        </div>
        <div className="platformGrid">
          {trustedPlatforms.map((platform) => (
            <article key={platform.name}>
              <div className="platformName"><strong>{platform.name}</strong><span>{platform.category}</span></div>
              <div className="platformUse"><small>USE CASE</small><p>{platform.useCase}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="why section" id="why">
        <div className="intro"><small>WHY SYED SOFTWARE</small><h2>Built without the usual <em>software headaches.</em></h2></div>
        <div className="whyGrid">
          <article><h3>Clear scope first</h3><p>You know what is being built and what is not before the work starts.</p></article>
          <article><h3>Direct communication</h3><p>You speak directly with the person responsible for building the solution.</p></article>
          <article><h3>Built around your workflow</h3><p>The software should adapt to the business — not force the business to adapt to it.</p></article>
          <article><h3>Clear handover</h3><p>You know what you are receiving, how it works and what support is included at launch.</p></article>
        </div>
      </section>

      <section className="packages section" id="packages">
        <div className="intro packageIntro"><h2>Simple packages.<br /><em>Clear expectations.</em></h2><p>Indicative ranges help you judge fit before a call. Final pricing is confirmed before work begins.</p></div>
        <div className="packageGrid">
          {packages.map((item, index) => (
            <article key={item.name} id={item.id}>
              <div className="packageTop"><span>0{index + 1}</span><small>{item.type}</small></div>
              <h3>{item.name}</h3>
              <strong className="packageOutcome">{item.outcome}</strong>
              <div className="packagePrice"><small>TYPICAL RANGE</small><b>{item.price}</b>{item.subprice && <span>{item.subprice}</span>}</div>
              <p>{item.copy}</p>
              <ul>{item.items.map((point) => <li key={point}>{point}</li>)}</ul>
              <a href="#quote-form">Get my scope &amp; price →</a>
            </article>
          ))}
        </div>
        <p className="pricingFootnote">Ranges are indicative and depend on integrations, workflow complexity and scope. Final pricing is confirmed before work begins.</p>
      </section>

      <section className="midCta">
        <div><small>HAVE A SPECIFIC PROBLEM?</small><h2>Tell us what is costing you <em>time or opportunities.</em></h2></div>
        <a className="primary" href="#quote-form">Show me the best approach <span>↗</span></a>
      </section>

      <section className="faq section" id="faq">
        <div className="intro"><small>BEFORE YOU ENQUIRE</small><h2>Common questions,<br /><em>answered clearly.</em></h2></div>
        <div className="faqList">
          {faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section className="quote" id="quote">
        <div>
          <small>START A PROJECT</small>
          <h2>What is costing your business <em>time or money?</em></h2>
          <p className="quoteLead">Tell us what is slowing the business down or costing you opportunities. We’ll reply with a clear recommendation and the next step.</p>
          <div className="reply">↳ <b>Typically replies within 1 business day</b></div>
        </div>
        <form id="quote-form" onSubmit={quote}>
          <label>Your name<input name="name" placeholder="e.g. Sarah Nguyen" required /></label>
          <label>Email address<input name="email" type="email" placeholder="you@business.com" required /></label>
          <label>What are you trying to improve?<textarea name="details" rows={6} placeholder="e.g. We miss calls while staff are busy and want customers followed up automatically…" required /></label>
          <button disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Get my scope & price"} <span>↗</span></button>
          <p className="formReassurance">No obligation. We only need enough detail to understand the problem.</p>
          {formMessage && <p className={`note ${formState === "error" ? "error" : ""}`} role="status">{formMessage}</p>}
        </form>
      </section>

      <footer><a className="brand" href="#top"><b><i /><i /><i /></b><span>SYED<small>SOFTWARE</small></span></a><p>Practical software for ambitious local businesses.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
