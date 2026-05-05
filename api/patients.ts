import { supabase } from '../lib/supabase';

export default async function handler(req: Request) {
  const { method, url } = req;

  if (method === 'GET') {
    const { data } = await supabase.from('patients').select('*');
    return Response.json(data);
  }

  if (method === 'POST') {
    const body = await req.json();
    const { data } = await supabase.from('patients').insert(body).select().single();
    return Response.json(data);
  }

  if (method === 'PUT') {
    const { id, ...rest } = await req.json();
    const { data } = await supabase.from('patients').update(rest).eq('id', id).select().single();
    return Response.json(data);
  }

  if (method === 'DELETE') {
    const id = new URL(url).searchParams.get('id');
    await supabase.from('patients').delete().eq('id', id!);
    return Response.json({ ok: true });
  }

  return new Response('Method not allowed', { status: 405 });
}
