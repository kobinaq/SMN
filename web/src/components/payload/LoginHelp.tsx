import Link from "next/link";

export default function LoginHelp() {
  return (
    <div className="smn-login-help">
      <span>Staff access only</span>
      <Link href="/">Return to website</Link>
      <Link href="/login">Member sign in</Link>
    </div>
  );
}