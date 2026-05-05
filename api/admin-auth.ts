import { supabase } from '../lib/supabase';

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { discord_id, password } = await req.json();
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('discord_id', discord_id)
    .single();

  if (error || !data) return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  // In real app, use bcrypt to compare passwords
  if (data.password !== password) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

  const { password: _, ...user } = data;
  const token = btoa(`${discord_id}:${Date.now()}`); // Replace with JWT in prod
  return Response.json({ token, user });
}
