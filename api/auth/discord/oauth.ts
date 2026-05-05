import { supabase } from '../../lib/supabase';

const clientId = process.env.DISCORD_CLIENT_ID!;
const clientSecret = process.env.DISCORD_CLIENT_SECRET!;
const redirectUri = process.env.DISCORD_REDIRECT_URI!;

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  // Step 1: Redirect to Discord OAuth
  if (!code) {
    const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;
    return Response.redirect(discordUrl);
  }

  // Step 2: Exchange code for token
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });
  const { access_token } = await tokenRes.json();

  // Step 3: Get Discord user info
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const discordUser = await userRes.json();

  // Step 4: Find or create patient in Supabase
  let { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('discord_id', discordUser.id)
    .single();

  if (!patient) {
    const newPatient = {
      id: `patient_${Date.now()}`,
      mrn: `MRN-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      name: discordUser.username,
      discord_id: discordUser.id,
      date_of_birth: '',
      gender: 'male',
      blood_type: 'O+',
      phone: '',
      allergies: [],
      status: 'active',
      registration_date: new Date().toISOString().split('T')[0],
    };
    const { data } = await supabase.from('patients').insert(newPatient).select().single();
    patient = data;
  }

  // Step 5: Find or create admin user in Supabase
  let { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('discord_id', `${discordUser.username}#${discordUser.discriminator || '0000'}`)
    .single();

  // Step 6: Return JWT-like token (replace with real JWT in prod)
  const token = btoa(`${discordUser.id}:${Date.now()}`);
  const { password: _, ...userData } = adminUser || {};

  return Response.json({
    token,
    user: patient ? { ...patient, type: 'patient' } : { ...userData, type: 'admin' },
    needsProfile: !patient?.profileCompleted,
  });
}
