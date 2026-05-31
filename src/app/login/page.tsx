import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; verified?: string }>;
}) {
  const { registered, verified } = await searchParams;
  return (
    <LoginForm
      showRegisteredMessage={registered === "1"}
      showVerifiedMessage={verified === "1"}
    />
  );
}
