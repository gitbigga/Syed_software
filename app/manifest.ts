import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leverage Systems",
    short_name: "Leverage Systems",
    description: "Business automation systems built around real operational bottlenecks.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f6f4",
    theme_color: "#1b2226",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
