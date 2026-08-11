"use client";
import { useEffect, useRef } from "react";

export default function ProgressRing({ percentage = 0, color = "#7c3aed", size = 80, strokeWidth = 7, label = "" }) {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = offset;
    }
  }, [offset]);

  return (
    <div className="progress-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="progress-ring-center">
        <span className="progress-ring-pct">{percentage}%</span>
        {label && <span className="progress-ring-label">{label}</span>}
      </div>
    </div>
  );
}
