import { supabase } from '../lib/supabase';

export default async function handler(req: Request) {
  const { method, url } = req;

  if (method === 'GET') {
    const patient_id = new URL(url).searchParams.get('patient_id');
    let query = supabase.from('medical_records').select('*');
    if (patient_id) query = query.eq('patient_id', patient_id);
    const { data } = await query;
    return Response.json(data);
  }

  if (method === 'POST') {
    const body = await req.json();
    const { data } = await supabase.from('medical_records').insert(body).select().single();
    return Response.json(data);
  }

  if (method === 'PUT') {
    const { id, ...rest } = await req.json();
    const { data } = await supabase.from('medical_records').update(rest).eq('id', id).select().single();
    return Response.json(data);
  }

  if (method === 'DELETE') {
    const id = new URL(url).searchParams.get('id');
    await supabase.from('medical_records').delete().eq('id', id!);
    return Response.json({ ok: true });
  }

  return new Response('Method not allowed', { status: 405 });
}
