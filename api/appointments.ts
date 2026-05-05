import { supabase } from '../lib/supabase';

export default async function handler(req: Request) {
  const { method, url } = req;

  if (method === 'GET') {
    const discord_id = new URL(url).searchParams.get('discord_id');
    let query = supabase.from('appointments').select('*');
    if (discord_id) query = query.eq('discord_id', discord_id);
    const { data } = await query;
    return Response.json(data);
  }

  if (method === 'POST') {
    const body = await req.json();
    const { data } = await supabase.from('appointments').insert(body).select().single();
    return Response.json(data);
  }

  if (method === 'PUT') {
    const { id, ...rest } = await req.json();
    const { data } = await supabase.from('appointments').update(rest).eq('id', id).select().single();
    return Response.json(data);
  }

  return new Response('Method not allowed', { status: 405 });
}
