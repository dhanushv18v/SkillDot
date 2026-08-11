"use client";

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: "topics",
    label: "Topics",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" fill={active ? "rgba(124,58,237,0.15)" : "none"}/>
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "rgba(124,58,237,0.2)" : "none"}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav-track" />
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`bottom-nav-item ${isActive ? "bottom-nav-item--active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            id={`bottom-nav-${tab.id}`}
            aria-selected={isActive}
          >
            <span className="bottom-nav-icon">{tab.icon(isActive)}</span>
            <span className="bottom-nav-label">{tab.label}</span>
            {isActive && <span className="bottom-nav-pip" />}
          </button>
        );
      })}
    </nav>
  );
}
