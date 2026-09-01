import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoClients, getDemoClient } from "../../../lib/demo-clients";
import styles from "./page.module.css";

type DemoPageProps = {
  params: Promise<{ slug: string }>;
};

type BrandStyle = CSSProperties & {
  "--client-primary": string;
  "--client-primary-dark": string;
  "--client-surface": string;
  "--client-surface-strong": string;
  "--client-ink": string;
  "--client-muted": string;
};

export function generateStaticParams() {
  return Object.keys(demoClients).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = getDemoClient(slug);

  if (!client) return {};

  return {
    title: `${client.company} concept | Leverage Systems`,
    description: client.intro,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${client.company} concept | Leverage Systems`,
      description: client.intro,
    },
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const client = getDemoClient(slug);

  if (!client) notFound();

  const brandStyle: BrandStyle = {
    "--client-primary": client.brand.primary,
    "--client-primary-dark": client.brand.primaryDark,
    "--client-surface": client.brand.surface,
    "--client-surface-strong": client.brand.surfaceStrong,
    "--client-ink": client.brand.ink,
    "--client-muted": client.brand.muted,
  };

  return (
    <main className={styles.page} style={brandStyle}>
      <header className={styles.header}>
        <a className={styles.leverageBrand} href="/" aria-label="Leverage Systems home">
          <img src="/brand/leverage-systems-logo.svg" alt="Leverage Systems" />
        </a>
        <span className={styles.prepared}>Prepared for {client.company}</span>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.clientIdentity}>
            <img src={client.logo} alt={`${client.company} logo`} />
            <div>
              <span>{client.company}</span>
              {client.location && <small>{client.location}</small>}
            </div>
          </div>
          <p className={styles.eyebrow}>{client.eyebrow}</p>
          <h1>{client.headline}</h1>
          <p className={styles.intro}>{client.intro}</p>
          <a className={styles.primaryCta} href="#demo">Watch the tailored demo <span>↓</span></a>
        </div>

        <div className={styles.heroPanel} aria-hidden="true">
          <span className={styles.panelLabel}>MISSED CALL</span>
          <div className={styles.signalRow}><i /> Patient calls the practice</div>
          <div className={styles.connector}>↓</div>
          <span className={styles.panelLabel}>LEVERAGE SYSTEM</span>
          <div className={styles.signalRow}><i /> Helpful SMS sent automatically</div>
          <div className={styles.connector}>↓</div>
          <span className={styles.panelLabel}>OUTCOME</span>
          <div className={styles.signalRow}><i /> Clear path back to booking</div>
        </div>
      </section>

      <section className={styles.demoSection} id="demo">
        <div className={styles.sectionHeading}>
          <p>THE CONCEPT</p>
          <h2>See the workflow as the patient would experience it.</h2>
          <span>This is an illustrative capability demonstration. It is not presented as a completed client project or measured client result.</span>
        </div>
        <div className={styles.videoShell}>
          <video controls playsInline preload="metadata" aria-label={`${client.company} missed-call automation demo`}>
            <source src={client.video} type="video/mp4" />
            Your browser does not support embedded video.
          </video>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className={styles.sectionHeading}>
          <p>HOW IT WORKS</p>
          <h2>One small workflow, focused on one expensive gap.</h2>
        </div>
        <div className={styles.steps}>
          {client.steps.map((step, index) => (
            <article key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <p>PREPARED FOR {client.company.toUpperCase()}</p>
        <h2>If this workflow is useful, the next step is simply confirming how it should fit your current phone and booking process.</h2>
        <div className={styles.ctaActions}>
          <a className={styles.primaryCta} href="/#workflow-form">Discuss this workflow <span>↗</span></a>
          <a href="#demo">Watch demo again ↑</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Leverage Systems</span>
        <span>Tailored concept prepared for {client.company}</span>
      </footer>
    </main>
  );
}
