import React, { useEffect, useState } from 'react';
import { LockKeyhole, Wrench, LogIn, Mail, ShieldCheck, AlertTriangle } from 'lucide-react';
import { supabase, supabaseConfigured, supabaseConfigError } from './lib/supabase.js';
import App from './App.jsx';

function readableAuthError(error) {
  const code = error?.code || '';
  const raw = String(error?.message || '');
  const normalized = raw.toLowerCase();

  if (code === 'invalid_credentials' || normalized.includes('invalid login credentials')) {
    return 'O Supabase recusou o e-mail ou a senha. Se você confirmou os dois, confira se a Vercel está usando a URL e a chave pública do MESMO projeto Supabase onde esse usuário foi criado.';
  }
  if (code === 'email_not_confirmed' || normalized.includes('email not confirmed')) {
    return 'Este usuário ainda não confirmou o e-mail. No Supabase, abra Authentication → Users, selecione o usuário e confirme o e-mail, se essa for a conta correta.';
  }
  if (code === 'user_banned' || normalized.includes('user is banned')) {
    return 'Este usuário está bloqueado no Supabase. Confira o status da conta em Authentication → Users.';
  }
  if (normalized.includes('fetch') || normalized.includes('network')) {
    return 'Não foi possível alcançar o Supabase. Confira a URL do projeto, a conexão e as variáveis de ambiente da Vercel.';
  }
  if (normalized.includes('too many requests') || code === 'over_request_rate_limit') {
    return 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
  }
  if (raw) return 'Falha de autenticação (' + (code || 'Supabase') + '): ' + raw;
  return 'Não foi possível entrar. Confira o usuário e as configurações do projeto Supabase.';
}

export default function AuthGate() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabaseConfigured || !supabase) { setLoading(false); return; }
    let alive = true;
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setMessage('Não foi possível verificar a sessão: ' + (error.message || 'confira as configurações do Supabase.'));
        setSession(data?.session || null);
      })
      .catch((error) => {
        if (alive) setMessage('Falha ao conectar ao Supabase: ' + (error?.message || 'confira a URL, a chave pública e sua conexão.'));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  async function signIn(event) {
    event.preventDefault();
    if (!supabase) { setMessage(supabaseConfigError || 'Supabase não está configurado.'); return; }
    setBusy(true);
    setMessage('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setMessage(readableAuthError(error));
      } else if (!data?.session) {
        setMessage('O Supabase aceitou a solicitação, mas não retornou uma sessão. Confira se o e-mail está confirmado e tente novamente.');
      } else {
        setSession(data.session);
      }
    } catch (error) {
      setMessage('Não foi possível conectar ao Supabase: ' + (error?.message || 'confira a conexão e as configurações da Vercel.'));
    } finally {
      setBusy(false);
    }
  }

  if (!supabaseConfigured) return <main className="setup-screen"><section className="login-card"><div className="login-brand"><Wrench/><div><b>AutoManager</b><small>OFICINA PRO</small></div></div><h1>Configuração necessária</h1><p>{supabaseConfigError || 'O aplicativo ainda não está conectado ao Supabase.'}</p><p>Na Vercel, configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> (ou a variável antiga <code>VITE_SUPABASE_ANON_KEY</code>) e faça um novo deploy.</p><p className="login-note"><ShieldCheck size={17}/> Nunca coloque a chave <code>service_role</code> no frontend.</p></section></main>;
  if (loading) return <main className="setup-screen"><div className="login-card"><p>Verificando sessão segura…</p>{message && <p role="alert" className="login-error">{message}</p>}</div></main>;
  if (session) return <App />;

  return <main className="setup-screen"><section className="login-card">
    <div className="login-brand"><div className="login-icon"><Wrench/></div><div><b>AutoManager</b><small>OFICINA PRO</small></div></div>
    <span className="login-eyebrow"><LockKeyhole size={14}/> ACESSO RESTRITO</span>
    <h1>Entre na sua oficina</h1><p className="login-subtitle">Use o e-mail e a senha fornecidos pelo administrador.</p>
    <form onSubmit={signIn} className="login-form">
      <label>E-mail<div className="login-input"><Mail size={17}/><input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@oficina.com.br"/></div></label>
      <label>Senha<div className="login-input"><LockKeyhole size={17}/><input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha"/></div></label>
      {message && <p role="alert" className="login-error"><AlertTriangle size={15}/> {message}</p>}
      <button className="primary-btn login-submit" disabled={busy} type="submit"><LogIn size={17}/>{busy?'Verificando…':'Entrar com segurança'}</button>
    </form><p className="login-foot"><ShieldCheck size={15}/> Acesso protegido por autenticação.</p>
  </section></main>;
}
