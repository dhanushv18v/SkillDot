"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CategorySection from "@/components/CategorySection";
import StatsBar from "@/components/StatsBar";
import BottomNav from "@/components/BottomNav";
import MobileOverview from "@/components/MobileOverview";
import MobileProfile from "@/components/MobileProfile";
import { onAuthChange } from "@/lib/auth";
import { subscribeToProgress, toggleTopic } from "@/lib/firestore";
import { CATEGORIES, TOTAL_TOPICS } from "@/data/topics";

const DEMO_USER_KEY = "skilldot_demo_mode";
const DEMO_PROGRESS_KEY = "skilldot_demo_progress";
const DEMO_NAME_KEY = "skilldot_demo_name";

const DEMO_USER = {
  uid: "demo",
  displayName: "Demo User",
  email: "demo@skilldot.app",
  photoURL: null,
};

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [completedTopics, setCompletedTopics] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileTab, setMobileTab] = useState("overview"); // overview | topics | profile
  const [displayName, setDisplayName] = useState(""); // lifted so profile edits sync everywhere
  const router = useRouter();

  // Auth / Demo guard
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(DEMO_USER_KEY) === "true") {
      setIsDemo(true);
      setUser(DEMO_USER);
      // Read persisted demo name (falls back to "Demo User")
      const savedName = localStorage.getItem(DEMO_NAME_KEY) || DEMO_USER.displayName;
      setDisplayName(savedName);
      try {
        const saved = JSON.parse(localStorage.getItem(DEMO_PROGRESS_KEY) || "{}");
        setCompletedTopics(saved);
      } catch { setCompletedTopics({}); }
      setAuthLoading(false);
      return;
    }
    const unsub = onAuthChange((u) => {
      if (!u) { router.replace("/auth"); }
      else {
        setUser(u);
        // Firebase always returns latest displayName after updateProfile
        setDisplayName(u.displayName || u.email?.split("@")[0] || "");
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  // Real-time Firestore subscription
  useEffect(() => {
    if (!user || isDemo) return;
    const unsub = subscribeToProgress(user.uid, (data) => setCompletedTopics(data));
    return () => unsub();
  }, [user, isDemo]);

  const handleToggle = useCallback(async (topicId, isCompleted) => {
    if (!user) return;
    setCompletedTopics((prev) => {
      const next = { ...prev, [topicId]: isCompleted };
      if (isDemo) localStorage.setItem(DEMO_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
    if (!isDemo) {
      try {
        await toggleTopic(user.uid, topicId, isCompleted);
      } catch (err) {
        setCompletedTopics((prev) => ({ ...prev, [topicId]: !isCompleted }));
      }
    }
  }, [user, isDemo]);

  const handleExitDemo = () => {
    localStorage.removeItem(DEMO_USER_KEY);
    localStorage.removeItem(DEMO_PROGRESS_KEY);
    router.push("/auth");
  };

  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const greeting = getGreeting(displayName || user?.email);

  const filters = [
    { id: "all", label: "All" },
    ...CATEGORIES.map((c) => ({ id: c.id, label: `${c.icon} ${c.shortName}` })),
  ];

  const visibleCategories = activeFilter === "all"
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.id === activeFilter);

  if (authLoading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10, 10, 28, 0.98)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <span className="brand-dot" style={{ fontSize: "1.8rem" }}>●</span>
          <span className="brand-text" style={{ fontSize: "1.8rem" }}>SkillDot</span>
        </div>
        <div className="auth-line-loader">
          <div className="auth-line-fill" />
        </div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <>
      {/* ── Desktop Navbar (hidden on mobile) ── */}
      <Navbar completedCount={completedCount} />

      {/* ── Demo bar (both breakpoints) ── */}
      {isDemo && (
        <div className="demo-mode-bar">
          <span>⚡ <strong>Demo Mode</strong> — saved locally</span>
          <button className="demo-exit-btn" onClick={handleExitDemo} id="demo-exit-btn">
            Create Account →
          </button>
        </div>
      )}

      {/* ════════════════════════════
          MOBILE LAYOUT
      ════════════════════════════ */}
      <div className="mobile-layout" id="mobile-layout">
        {/* Mobile top bar */}
        <header className="mobile-topbar">
          <div className="mobile-topbar-left">
            <span className="brand-dot" style={{ fontSize: "1.3rem" }}>●</span>
            <span className="brand-text" style={{ fontSize: "1.1rem" }}>SkillDot</span>
          </div>
          <div className="mobile-topbar-count">
            <span className="mob-count-badge">{completedCount}/{TOTAL_TOPICS}</span>
          </div>
        </header>

        {/* Tab content — slides */}
        <div className="mobile-tab-content">

          {/* ── OVERVIEW TAB ── */}
          <div className={`mobile-tab-pane ${mobileTab === "overview" ? "mobile-tab-pane--active" : ""}`}
            id="mob-tab-overview">
            <MobileOverview
              completedTopics={completedTopics}
              greeting={greeting}
            />
          </div>

          {/* ── TOPICS TAB ── */}
          <div className={`mobile-tab-pane ${mobileTab === "topics" ? "mobile-tab-pane--active" : ""}`}
            id="mob-tab-topics">
            <div className="mob-topics-inner">
              {/* Greeting */}
              <div className="mob-topics-greeting">
                <h1 className="mob-greeting-text">{greeting}</h1>
                <p className="mob-greeting-sub">
                  {completedCount === 0
                    ? "Tap a topic to mark it done 🎯"
                    : `${TOTAL_TOPICS - completedCount} topics left to master`}
                </p>
              </div>

              {/* Horizontal scroll filter pills */}
              <div className="mob-filter-scroll" role="tablist">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    className={`mob-filter-pill ${activeFilter === f.id ? "mob-filter-pill--active" : ""}`}
                    onClick={() => setActiveFilter(f.id)}
                    id={`mob-filter-${f.id}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Category sections */}
              <div className="categories-container">
                {visibleCategories.map((category) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    completedTopics={completedTopics}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── PROFILE TAB ── */}
          <div className={`mobile-tab-pane ${mobileTab === "profile" ? "mobile-tab-pane--active" : ""}`}
            id="mob-tab-profile">
            <MobileProfile
              user={user}
              isDemo={isDemo}
              completedTopics={completedTopics}
              onExitDemo={handleExitDemo}
              displayName={displayName}
              onNameChange={setDisplayName}
            />
          </div>
        </div>

        {/* Bottom navigation */}
        <BottomNav activeTab={mobileTab} onTabChange={setMobileTab} />
      </div>

      {/* ════════════════════════════
          DESKTOP LAYOUT
      ════════════════════════════ */}
      <main className="desktop-layout dashboard-page" id="dashboard-main"
        style={isDemo ? { paddingTop: "calc(var(--navbar-h) + 44px)" } : {}}>
        <div className="dashboard-inner">
          <div className="dashboard-welcome">
            <h1 className="dashboard-greeting">{greeting}</h1>
            <p className="dashboard-subtext">
              {completedCount === 0
                ? "Pick your first topic and start your journey 🚀"
                : completedCount === TOTAL_TOPICS
                ? "You've conquered all 57 topics! Absolutely brilliant! 🏆"
                : `Keep going — ${TOTAL_TOPICS - completedCount} topics left to master.`}
            </p>
          </div>
          <StatsBar completedTopics={completedTopics} />
          <div className="filter-tabs" role="tablist" aria-label="Filter by category">
            {[{ id: "all", label: "📋 All Categories" }, ...CATEGORIES.map((c) => ({ id: c.id, label: `${c.icon} ${c.shortName}` }))].map((f) => (
              <button key={f.id}
                className={`filter-tab ${activeFilter === f.id ? "active" : ""}`}
                onClick={() => setActiveFilter(f.id)}
                role="tab" aria-selected={activeFilter === f.id} id={`filter-${f.id}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="categories-container">
            {visibleCategories.map((category) => (
              <CategorySection key={category.id} category={category}
                completedTopics={completedTopics} onToggle={handleToggle} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function getGreeting(nameOrEmail) {
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  if (!nameOrEmail) return `${timeGreet}! 👋`;
  const name = nameOrEmail.includes("@") ? nameOrEmail.split("@")[0] : nameOrEmail.split(" ")[0];
  return `${timeGreet}, ${name}! 👋`;
}
