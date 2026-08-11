"use client";
import { logOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { CATEGORIES, TOTAL_TOPICS } from "@/data/topics";
import ProgressRing from "./ProgressRing";

const DEMO_NAME_KEY = "skilldot_demo_name";

export default function MobileProfile({ user, isDemo, completedTopics, onExitDemo, displayName, onNameChange }) {
  const router = useRouter();
  const totalDone = Object.values(completedTopics).filter(Boolean).length;
  const globalPct = Math.round((totalDone / TOTAL_TOPICS) * 100);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);

  const handleLogout = async () => {
    if (isDemo) { onExitDemo(); }
    else { await logOut(); router.push("/"); }
  };

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    // Persist immediately so refresh keeps the new name
    if (isDemo) {
      localStorage.setItem(DEMO_NAME_KEY, trimmed);
    } else {
      try {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      } catch (e) {
        console.error("Failed to update name:", e);
      }
    }
    onNameChange(trimmed);
    setEditingName(false);
  };

  const handleStartEdit = () => {
    setNameInput(displayName); // sync latest value when opening
    setEditingName(true);
  };

  const initials = ((displayName || user?.email || "D")[0]).toUpperCase();

  return (
    <div className="mobile-profile">

      {/* ── Avatar + Name card ── */}
      <div className="mob-profile-card glass">
        <div className="mob-avatar-ring">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="mob-avatar-img" referrerPolicy="no-referrer" />
          ) : (
            <div className="mob-avatar-fallback">{initials}</div>
          )}
          {isDemo && <span className="mob-demo-tag">DEMO</span>}
        </div>

        {/* Editable name */}
        <div className="mob-name-row">
          {editingName ? (
            <div className="mob-name-edit-wrap">
              <input
                className="mob-name-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                id="mob-name-input"
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              />
              <button className="mob-name-save-btn" onClick={handleSaveName} id="mob-name-save">
                Save
              </button>
            </div>
          ) : (
            <div className="mob-name-display">
              <h2 className="mob-profile-name">{displayName}</h2>
              <button
                className="mob-edit-pencil"
                onClick={handleStartEdit}
                aria-label="Edit name"
                id="mob-edit-name-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <p className="mob-profile-email">{user?.email}</p>

        {/* Stats row */}
        <div className="mob-profile-stats">
          <div className="mob-profile-stat">
            <span className="mob-profile-stat-val">{totalDone}</span>
            <span className="mob-profile-stat-label">Done</span>
          </div>
          <div className="mob-profile-stat-div" />
          <div className="mob-profile-stat">
            <span className="mob-profile-stat-val">{TOTAL_TOPICS - totalDone}</span>
            <span className="mob-profile-stat-label">Left</span>
          </div>
          <div className="mob-profile-stat-div" />
          <div className="mob-profile-stat">
            <span className="mob-profile-stat-val">{globalPct}%</span>
            <span className="mob-profile-stat-label">Progress</span>
          </div>
        </div>
      </div>

      {/* ── Category Breakdown — unique card design ── */}
      <p className="mob-section-title">Category Breakdown</p>
      <div className="mob-catbreak-grid">
        {CATEGORIES.map((cat) => {
          const done = cat.topics.filter((t) => completedTopics[t.id]).length;
          const pct = Math.round((done / cat.topics.length) * 100);
          return (
            <div key={cat.id} className="mob-catbreak-card" style={{ "--cat-color": cat.color, "--cat-gradient": cat.gradient }}>
              {/* Glow blob */}
              <div className="mob-catbreak-blob" />
              {/* Top row */}
              <div className="mob-catbreak-top">
                <div className="mob-catbreak-icon-wrap">
                  <span className="mob-catbreak-icon">{cat.icon}</span>
                </div>
                <ProgressRing percentage={pct} color={cat.color} size={46} strokeWidth={4} />
              </div>
              {/* Name */}
              <p className="mob-catbreak-name">{cat.name}</p>
              {/* Pill progress */}
              <div className="mob-catbreak-pills">
                {cat.topics.map((t) => (
                  <div
                    key={t.id}
                    className="mob-catbreak-pill"
                    style={{ background: completedTopics[t.id] ? cat.color : "rgba(255,255,255,0.08)" }}
                  />
                ))}
              </div>
              {/* Footer */}
              <div className="mob-catbreak-footer">
                <span className="mob-catbreak-frac" style={{ color: cat.color }}>{done}/{cat.topics.length}</span>
                <span className="mob-catbreak-pct">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Actions ── */}
      <div className="mob-profile-actions">
        {isDemo && (
          <button className="mob-action-btn mob-action-primary" onClick={onExitDemo} id="mob-create-account-btn">
            ✨ Create Real Account
          </button>
        )}
        <button className="mob-action-btn mob-action-danger" onClick={handleLogout} id="mob-logout-btn">
          {isDemo ? "Exit Demo" : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
