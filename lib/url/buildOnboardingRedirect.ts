// lib/functions/buildOnboardingRedirect.ts
export function buildOnboardingRedirect(params: {
  email?: string;
  plan?: string;
}) {
  const query = new URLSearchParams();
  if (params.email) query.set("email", params.email);
  if (params.plan) query.set("plan", params.plan);

  return `/new-user/1?${query.toString()}`;
}
