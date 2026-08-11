import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Sign In — SkillDot",
  description: "Sign in or create your SkillDot account to start tracking your aptitude learning journey.",
};

export default function AuthPage() {
  return (
    <main className="auth-page" id="auth-main">
      <AuthForm />
    </main>
  );
}
