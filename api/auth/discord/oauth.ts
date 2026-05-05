import { supabase } from '../../lib/supabase';

const clientId = process.env.VITE_DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID!;
const clientSecret = process.env.DISCORD_CLIENT_SECRET!;
const redirectUri = process.env.DISCORD_REDIRECT_URI!;

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  // Step1: Redirect to Discord OAuth (no code yet)
  if (!code) {
    const type = url.searchParams.get('type') || 'patient';
    const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify&state=${type}`;
    return Response.redirect(discordUrl);
  }

  // Step2: Exchange code for token (Discord redirected back with code)
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
  const tokenData = await tokenRes.json();
  const { access_token } = tokenData;

  if (!access_token) {
    return new Response('Discord OAuth failed: ' + JSON.stringify(tokenData), { status: 400 });
  }

  // Step3: Get Discord user info
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const discordUser = await userRes.json();

  // Step4: Find or create patient in Supabase
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

  // Step5: Find admin user in Supabase (by Discord ID)
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('discord_id', discordUser.id)
    .single();

  // Step6: Create token and redirect to frontend
  const token = btoa(`${discordUser.id}:${Date.now()}`);
  const origin = new URL(req.url).origin;
  // Read type from state parameter (set in Step1)
  const stateType = url.searchParams.get('state') || 'patient';
  const userType = stateType === 'admin' ? 'admin' : 'patient';
  const needsProfile = !patient?.profileCompleted;

  return Response.redirect(
    `${origin}/auth/callback?token=${token}&type=${userType}&needsProfile=${needsProfile}`
  );
}
