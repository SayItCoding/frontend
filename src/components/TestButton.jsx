import React from "react";

export default function TestButton({ label = "test", onClick }) {
  return (
    <div style={wrapperStyle}>
      <button style={buttonStyle} onClick={onClick}>
        {label}
      </button>
    </div>
  );
}

const wrapperStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  pointerEvents: "none", // 주변 클릭 방해 방지
  zIndex: 1000,
};

const buttonStyle = {
  pointerEvents: "auto",
  padding: "12px 24px",
  borderRadius: "999px",
  border: "none",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  background: "#ff7b2e",
  color: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
};
