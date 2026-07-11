import Link from "next/link";

export default function LoginHelp() {
  return (
    <div className="smn-login-help">
      <span>Not staff?</span>
      <Link href="/login">Member sign in</Link>
      <Link href="/">Back to website</Link>
    </div>
  );
}