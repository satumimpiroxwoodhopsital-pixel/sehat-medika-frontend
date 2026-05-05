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

  // Exchange code (handled in oauth.ts, this is just redirect)
  return Response.redirect(
    `${process.env.VITE_PUBLIC_URL || 'http://localhost:5174'}/auth/callback?code=${code}&type=${type}`
  );
}
