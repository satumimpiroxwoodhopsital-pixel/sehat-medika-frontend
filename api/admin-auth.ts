import { supabase } from '../lib/supabase';

const DISCORD_OAUTH_FLAG = '__discord_oauth__';

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { discord_id, password } = await req.json();

  // Discord OAuth login (no password check)
  if (password === DISCORD_OAUTH_FLAG) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('discord_id', discord_id)
      .single();

    if (error || !data) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

    const { password: _, ...user } = data;
    const token = btoa(`${discord_id}:${Date.now()}`);
    return Response.json({ token, user });
  }

  // Regular login with password
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('discord_id', discord_id)
    .single();

  if (error || !data) return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  if (data.password !== password) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

  const { password: _, ...user } = data;
  const token = btoa(`${discord_id}:${Date.now()}`);
  return Response.json({ token, user });
}
