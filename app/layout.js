import "./globals.css";

export const metadata = {
  title: "SkillDot — Master Aptitude, One Topic at a Time",
  description:
    "Track your aptitude preparation journey across 57 topics in Quantitative, Logical Reasoning, Verbal Ability and IT-Specific Aptitude. Built for placement and competitive exam success.",
  keywords: "aptitude tracker, placement prep, quantitative aptitude, logical reasoning, verbal ability, IT aptitude, learning tracker",
  openGraph: {
    title: "SkillDot — Aptitude Learning Tracker",
    description: "Track 57 aptitude topics for placement and competitive exams.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
