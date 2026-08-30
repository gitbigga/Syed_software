export type DemoClient = {
  slug: string;
  company: string;
  location?: string;
  eyebrow: string;
  headline: string;
  intro: string;
  logo: string;
  video: string;
  brand: {
    primary: string;
    primaryDark: string;
    surface: string;
    surfaceStrong: string;
    ink: string;
    muted: string;
  };
  steps: Array<{ title: string; body: string }>;
  package: {
    title: string;
    description: string;
    inclusions: string[];
    usage: string;
    addOn: string;
  };
};

export const demoClients: Record<string, DemoClient> = {
  "gentle-dental-care": {
    slug: "gentle-dental-care",
    company: "Gentle Dental Care",
    location: "Campbelltown",
    eyebrow: "TAILORED CONCEPT DEMO",
    headline: "A missed call shouldn’t become a missed patient.",
    intro:
      "A simple missed-call follow-up workflow prepared for Gentle Dental Care: when the line is busy or a call is missed, the patient receives a helpful SMS and a clear path back to booking.",
    logo: "/clients/gentle-dental-care/logo.png",
    video: "/clients/gentle-dental-care/demo.mp4",
    brand: {
      primary: "#74518d",
      primaryDark: "#55475f",
      surface: "#f6f2f8",
      surfaceStrong: "#e9e1ee",
      ink: "#302b34",
      muted: "#726c77",
    },
    steps: [
      {
        title: "A call is missed",
        body: "If the practice can’t answer, the workflow can detect the missed-call event without adding another admin task for staff.",
      },
      {
        title: "The patient gets a useful SMS",
        body: "A business-specific message can be sent automatically, with clear next steps such as replying, choosing a time or calling back.",
      },
      {
        title: "The conversation moves toward booking",
        body: "The automation handles the immediate follow-up, while staff remain in control of anything that needs a person.",
      },
    ],
    package: {
      title: "Missed-call follow-up package",
      description:
        "A defined setup rather than an open-ended software project. Final pricing sits within a quoted range after the phone/SMS setup and workflow are confirmed.",
      inclusions: [
        "Initial workflow setup and testing",
        "Gentle Dental Care message templates",
        "Phone/SMS integration configuration",
        "Launch support and basic adjustments",
        "Up to 100 automated SMS/call actions per monthly billing period",
      ],
      usage:
        "Included actions reset each monthly billing period and do not roll over. This is stated in the service terms before launch.",
      addOn:
        "If usage grows, additional action blocks can be added as a packaged add-on rather than charging unpredictable per-message fees.",
    },
  },
};

export function getDemoClient(slug: string) {
  return demoClients[slug];
}
