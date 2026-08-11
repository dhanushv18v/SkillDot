"use client";
import { CATEGORIES, TOTAL_TOPICS } from "@/data/topics";
import ProgressRing from "./ProgressRing";

export default function MobileOverview({ completedTopics, greeting }) {
  const totalDone = Object.values(completedTopics).filter(Boolean).length;
  const globalPct = Math.round((totalDone / TOTAL_TOPICS) * 100);

  return (
    <div className="mobile-overview">

      {/* ── Greeting at top ── */}
      <div className="mob-overview-greeting">
        <h1 className="mob-overview-greet-text">{greeting}</h1>
        <p className="mob-overview-greet-sub">
          {totalDone === 0
            ? "Start ticking off topics! 🎯"
            : totalDone === TOTAL_TOPICS
            ? "You've mastered everything! 🏆"
            : `${TOTAL_TOPICS - totalDone} topics still to conquer`}
        </p>
      </div>

      {/* ── Hero progress card ── */}
      <div className="mob-hero-card glass">
        <div className="mob-hero-top">
          <div>
            <p className="mob-hero-label">Total Progress</p>
            <div className="mob-hero-numbers">
              <span className="mob-hero-done">{totalDone}</span>
              <span className="mob-hero-sep">/ {TOTAL_TOPICS}</span>
            </div>
            <p className="mob-milestone">{getMilestone(globalPct)}</p>
          </div>
          <ProgressRing percentage={globalPct} color="#7c3aed" size={90} strokeWidth={8} />
        </div>
        <div className="mob-global-bar">
          <div className="mob-global-fill" style={{ width: `${globalPct}%` }} />
        </div>
        <div className="mob-global-labels">
          <span className="mob-global-start">0</span>
          <span className="mob-global-pct">{globalPct}% complete</span>
          <span className="mob-global-end">57</span>
        </div>
      </div>

      {/* ── Category cards grid ── */}
      <p className="mob-section-title">Categories</p>
      <div className="mob-category-grid">
        {CATEGORIES.map((cat) => {
          const done = cat.topics.filter((t) => completedTopics[t.id]).length;
          const pct = Math.round((done / cat.topics.length) * 100);
          return (
            <div className="mob-cat-card glass" key={cat.id} style={{ "--cat-color": cat.color }}>
              <div className="mob-cat-top">
                <span className="mob-cat-icon">{cat.icon}</span>
                <ProgressRing percentage={pct} color={cat.color} size={52} strokeWidth={5} />
              </div>
              <p className="mob-cat-name">{cat.shortName}</p>
              <p className="mob-cat-fraction" style={{ color: cat.color }}>
                {done}<span style={{ color: "var(--text-muted)" }}>/{cat.topics.length}</span>
              </p>
              <div className="mob-cat-bar">
                <div className="mob-cat-fill" style={{ width: `${pct}%`, background: cat.gradient }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getMilestone(pct) {
  if (pct === 0) return "🚀 Let's begin!";
  if (pct < 25) return "🌱 Great start!";
  if (pct < 50) return "⚡ Building momentum!";
  if (pct < 75) return "🔥 Crushing it!";
  if (pct < 100) return "🏆 Almost there!";
  return "🎉 Mastered all!";
}
