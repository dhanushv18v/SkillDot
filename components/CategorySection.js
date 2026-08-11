"use client";
import { useState } from "react";
import TopicCard from "./TopicCard";
import ProgressRing from "./ProgressRing";

export default function CategorySection({ category, completedTopics, onToggle }) {
  const [collapsed, setCollapsed] = useState(false);

  const completedCount = category.topics.filter((t) => completedTopics[t.id]).length;
  const total = category.topics.length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const handleMarkAll = (e) => {
    e.stopPropagation();
    const allDone = completedCount === total;
    category.topics.forEach((t) => onToggle(t.id, !allDone));
  };

  return (
    <section className="category-section glass" id={`category-${category.id}`}>
      <div
        className="category-header"
        onClick={() => setCollapsed(!collapsed)}
        role="button"
        aria-expanded={!collapsed}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setCollapsed(!collapsed)}
        style={{ "--cat-color": category.color }}
      >
        <div className="category-header-left">
          <span className="category-icon">{category.icon}</span>
          <div>
            <h2 className="category-title" style={{ color: category.color }}>
              {category.name}
            </h2>
            <span className="category-meta">
              {completedCount} / {total} topics completed
            </span>
          </div>
        </div>

        <div className="category-header-right">
          <ProgressRing
            percentage={percentage}
            color={category.color}
            size={68}
            strokeWidth={6}
          />
          <button
            className="btn btn-ghost btn-sm mark-all-btn"
            onClick={handleMarkAll}
            id={`mark-all-${category.id}`}
            title={completedCount === total ? "Unmark all" : "Mark all complete"}
          >
            {completedCount === total ? "Reset" : "Mark All"}
          </button>
          <span className={`collapse-arrow ${collapsed ? "collapsed" : ""}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="category-progress-bar">
        <div
          className="category-progress-fill"
          style={{ width: `${percentage}%`, background: category.gradient }}
        />
      </div>

      {!collapsed && (
        <div className="topic-grid">
          {category.topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isCompleted={!!completedTopics[topic.id]}
              onToggle={onToggle}
              categoryColor={category.color}
            />
          ))}
        </div>
      )}
    </section>
  );
}
