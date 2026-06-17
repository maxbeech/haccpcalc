import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "HACCPCalc — free HACCP plan builder & food safety temperature calculator";

export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#059669",
              color: "white",
              fontSize: 40,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            H
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#0f172a" }}>HACCPCalc</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 64, fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
          Free HACCP plan builder
        </div>
        <div style={{ marginTop: 16, fontSize: 36, color: "#475569" }}>
          7-principle plans &amp; temperature logs · FDA Food Code 2022
        </div>
      </div>
    ),
    { ...size },
  );
}
