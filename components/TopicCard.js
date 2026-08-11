"use client";

const BADGE_COLORS = {
  BOTH: { bg: "#1e1b4b", text: "#818cf8", border: "#3730a3" },
  GOV: { bg: "#052e16", text: "#4ade80", border: "#166534" },
  IT: { bg: "#172554", text: "#60a5fa", border: "#1e40af" },
};

export default function TopicCard({ topic, isCompleted, onToggle, categoryColor }) {
  const badge = BADGE_COLORS[topic.badge] || BADGE_COLORS.BOTH;

  return (
    <div
      className={`topic-card ${isCompleted ? "topic-card--done" : ""}`}
      style={{ "--cat-color": categoryColor }}
      onClick={() => onToggle(topic.id, !isCompleted)}
      role="button"
      tabIndex={0}
      aria-pressed={isCompleted}
      onKeyDown={(e) => e.key === "Enter" && onToggle(topic.id, !isCompleted)}
      id={`topic-${topic.id}`}
    >
      <div className="topic-card-check">
        {isCompleted ? (
          <div className="check-circle check-circle--done">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : (
          <div className="check-circle check-circle--empty" />
        )}
      </div>

      <div className="topic-card-body">
        <div className="topic-card-header">
          <span className={`topic-name ${isCompleted ? "topic-name--done" : ""}`}>
            {topic.name}
          </span>
          <span
            className="topic-badge"
            style={{ background: badge.bg, color: badge.text, borderColor: badge.border }}
          >
            {topic.badge}
          </span>
        </div>
        <p className="topic-subtopics">{topic.subtopics}</p>
      </div>

      {isCompleted && <div className="topic-card-glow" />}
    </div>
  );
}
