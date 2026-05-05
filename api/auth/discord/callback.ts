// Auth callback - redirects to oauth handler
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const type = url.searchParams.get('type') || 'patient';

  if (!code) {
    return Response.redirect(
      `/api/auth/discord/oauth?type=${type}`
    );
  }

  // This should not be reached - Discord should redirect to oauth.ts
  // Redirect to oauth handler with the code
  return Response.redirect(
    `/api/auth/discord/oauth?code=${code}&state=${type}`
  );
}
