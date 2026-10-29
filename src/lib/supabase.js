import { createClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
// Current Supabase projects use a publishable key (sb_publishable_...).
// Keep the legacy anon variable as a backwards-compatible fallback.
const publicKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

let client = null;
let configError = '';

if (!url || !publicKey) {
  configError = 'Faltam as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nas configurações de ambiente da Vercel.';
} else {
  try {
    const parsedUrl = new URL(url);
    if (!['https:', 'http:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
      throw new Error('A URL precisa começar com https:// e apontar para o projeto Supabase.');
    }
    client = createClient(url, publicKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  } catch (error) {
    configError = error instanceof Error
      ? 'Configuração do Supabase inválida: ' + error.message
      : 'Não foi possível inicializar o Supabase. Confira a URL e a chave pública.';
    client = null;
  }
}

export const supabase = client;
export const supabaseConfigured = Boolean(client);
export const supabaseConfigError = configError;

export async function loadRecords(table) {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { data, error } = await supabase.from(table).select('id,payload').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => row.payload);
}

export async function saveRecord(table, record) {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Sua sessão expirou. Entre novamente.');
  const { error } = await supabase.from(table).upsert({ id: record.id, user_id: user.id, payload: record, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteRecord(table, id) {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}
