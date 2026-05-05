import { supabase } from '../lib/supabase';

export default async function handler(req: Request) {
  const auth = req.headers.get('Authorization');
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const token = auth.replace('Bearer ', '');
  try {
    const [discord_id] = atob(token).split(':');
    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('discord_id', discord_id)
      .single();
    if (!data) throw new Error();
    const { password: _, ...user } = data;
    return Response.json({ user });
  } catch {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }
}
