import Link from "next/link";
export default function RegisterPage() {
  return (
    <section>
      <h1>Create your account</h1>
      <p className="muted">Registration is available through the API-backed account flow.</p>
      <Link href="/login">Already have an account?</Link>
    </section>
  );
}
