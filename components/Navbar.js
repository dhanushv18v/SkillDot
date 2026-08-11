"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthChange, logOut } from "@/lib/auth";
import { TOTAL_TOPICS } from "@/data/topics";

export default function Navbar({ completedCount = 0 }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await logOut();
    router.push("/");
  };

  const progressPct = TOTAL_TOPICS > 0 ? Math.round((completedCount / TOTAL_TOPICS) * 100) : 0;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="brand-dot">●</span>
          <span className="brand-text">SkillDot</span>
        </Link>

        {user && (
          <div className="navbar-progress">
            <span className="progress-label">{completedCount}/{TOTAL_TOPICS} topics</span>
            <div className="progress-pill">
              <div className="progress-pill-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="progress-pct">{progressPct}%</span>
          </div>
        )}

        <div className="navbar-right">
          {user ? (
            <div className="user-menu-wrap">
              <button
                className="user-avatar-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="User menu"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="user-avatar-img" referrerPolicy="no-referrer" />
                ) : (
                  <div className="user-avatar-fallback">
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-name">{user.displayName || user.email}</div>
                  <div className="user-dropdown-email">{user.email}</div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
