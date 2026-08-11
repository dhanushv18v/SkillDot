"use client";
import { CATEGORIES, TOTAL_TOPICS } from "@/data/topics";

export default function StatsBar({ completedTopics = {} }) {
  const totalDone = Object.values(completedTopics).filter(Boolean).length;
  const globalPct = Math.round((totalDone / TOTAL_TOPICS) * 100);

  return (
    <div className="stats-bar glass">
      <div className="stats-bar-inner">
        {/* Overall */}
        <div className="stats-overall">
          <div className="stats-overall-numbers">
            <span className="stats-done">{totalDone}</span>
            <span className="stats-sep">/</span>
            <span className="stats-total">{TOTAL_TOPICS}</span>
            <span className="stats-label">Topics Mastered</span>
          </div>
          <div className="stats-global-bar">
            <div className="stats-global-fill" style={{ width: `${globalPct}%` }} />
            <span className="stats-global-pct">{globalPct}%</span>
          </div>
          <div className="stats-milestone">{getMilestoneMessage(globalPct)}</div>
        </div>

        {/* Per-category mini stats */}
        <div className="stats-categories">
          {CATEGORIES.map((cat) => {
            const done = cat.topics.filter((t) => completedTopics[t.id]).length;
            const pct = Math.round((done / cat.topics.length) * 100);
            return (
              <div className="stats-cat-chip" key={cat.id}>
                <span className="stats-cat-icon">{cat.icon}</span>
                <div className="stats-cat-info">
                  <span className="stats-cat-name">{cat.shortName}</span>
                  <div className="stats-cat-bar">
                    <div
                      className="stats-cat-fill"
                      style={{ width: `${pct}%`, background: cat.gradient }}
                    />
                  </div>
                  <span className="stats-cat-fraction">{done}/{cat.topics.length}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getMilestoneMessage(pct) {
  if (pct === 0) return "🚀 Let's begin your journey!";
  if (pct < 25) return "🌱 Great start — keep going!";
  if (pct < 50) return "⚡ You're building momentum!";
  if (pct < 75) return "🔥 Halfway there — you're crushing it!";
  if (pct < 100) return "🏆 Almost there — the finish line awaits!";
  return "🎉 You've mastered all topics! Incredible!";
}
