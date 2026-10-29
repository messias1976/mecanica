import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
// Current Supabase projects use a publishable key (sb_publishable_...).
// Keep the legacy anon variable as a backwards-compatible fallback.
const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && publicKey);
export const supabase = supabaseConfigured ? createClient(url, publicKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;

export async function loadRecords(table) {
  const { data, error } = await supabase.from(table).select('id,payload').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => row.payload);
}

export async function saveRecord(table, record) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Sua sessão expirou. Entre novamente.');
  const { error } = await supabase.from(table).upsert({ id: record.id, user_id: user.id, payload: record, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteRecord(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}
