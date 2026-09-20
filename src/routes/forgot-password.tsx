import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthFrame } from "@/components/auth-frame";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <AuthFrame
      title="Reset password"
      subtitle="Email recovery is not enabled in this workspace. Use Google or X, or sign in if you still have the password."
    >
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted">
          Nexora signs in with Google, X, or an email and password stored in this
          app. There is no outbound mailer, so we cannot send a reset link.
        </p>
        <Button asChild className="w-full">
          <Link to="/login">Back to sign in</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to="/register">Create a new account</Link>
        </Button>
      </div>
    </AuthFrame>
  );
}
