import { supabase } from './lib/supabase';

export default async function handler(req: Request) {
  const { method, url } = req;

  if (method === 'GET') {
    const { data } = await supabase.from('jobs').select('*').eq('is_published', true).eq('is_closed', false);
    return Response.json(data);
  }

  if (method === 'POST') {
    const body = await req.json();
    const { data } = await supabase.from('jobs').insert(body).select().single();
    return Response.json(data);
  }

  if (method === 'PUT') {
    const { id, ...rest } = await req.json();
    const { data } = await supabase.from('jobs').update(rest).eq('id', id).select().single();
    return Response.json(data);
  }

  return new Response('Method not allowed', { status: 405 });
}
