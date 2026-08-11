"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
      color: ["#7c3aed", "#06b6d4", "#f43f5e", "#f59e0b"][Math.floor(Math.random() * 4)],
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color + Math.floor(d.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot">●</span> One dot at a time
        </div>
        <h1 className="hero-title">
          Master Aptitude,{" "}
          <span className="gradient-text">One Topic</span>
          <br /> at a Time
        </h1>
        <p className="hero-subtitle">
          Track your aptitude preparation across 57 topics — Quantitative, Logical, Verbal & IT.
          Designed for placement & competitive exam success.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">57</div>
            <div className="hero-stat-label">Total Topics</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-number">4</div>
            <div className="hero-stat-label">Categories</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-number">∞</div>
            <div className="hero-stat-label">Motivation</div>
          </div>
        </div>

        <div className="hero-actions">
          <Link href="/auth" className="btn btn-primary btn-lg" id="hero-start-btn">
            Start Tracking Free →
          </Link>
          <Link href="/auth" className="btn btn-outline btn-lg" id="hero-signin-btn">
            Sign In
          </Link>
        </div>

        <div className="hero-category-pills">
          {["🔢 Quant", "🧩 Logical", "📖 Verbal", "💻 IT-Specific"].map((c) => (
            <span key={c} className="category-pill">{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
