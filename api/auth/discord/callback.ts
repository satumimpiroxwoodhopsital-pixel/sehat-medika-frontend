// Auth callback - redirects to frontend with token
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const type = url.searchParams.get('type') || 'patient'; // 'patient' or 'admin'

  if (!code) {
    return Response.redirect(
      `/api/auth/discord/oauth?type=${type}`
    );
  }

  // Redirect to frontend with code for handling
  const origin = new URL(req.url).origin;
  return Response.redirect(
    `${origin}/auth/callback?code=${code}&type=${type}`
  );
}
