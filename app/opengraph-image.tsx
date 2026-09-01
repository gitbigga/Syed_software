import { ImageResponse } from "next/og";

export const alt = "Leverage Systems — Automate the work slowing your business down";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const cells = Array.from({ length: 9 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 78px",
          background: "#f3f6f4",
          color: "#1b2226",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "760px" }}>
          <div style={{ fontSize: 26, letterSpacing: 4, color: "#1b4255", fontWeight: 700 }}>
            LEVERAGE SYSTEMS
          </div>
          <div style={{ fontSize: 76, lineHeight: 0.98, letterSpacing: -4, fontWeight: 800, marginTop: 34 }}>
            Automate the work slowing your business down.
          </div>
          <div style={{ fontSize: 27, lineHeight: 1.35, color: "#657278", marginTop: 30 }}>
            Business automation built around real operational bottlenecks.
          </div>
        </div>
        <div
          style={{
            width: "276px",
            height: "276px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {cells.map((_, index) => (
            <div
              key={index}
              style={{
                width: "84px",
                height: "84px",
                background: index === 8 ? "#b7e800" : "#1b4255",
              }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
