import React, { useEffect, useState } from 'react';
import { LockKeyhole, Wrench, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase.js';
import App from './App.jsx';

export default function AuthGate() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return; }
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) setMessage('Não foi possível verificar a sessão. Confira a configuração do Supabase.');
      setSession(data?.session || null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  async function signIn(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setMessage('Não foi possível entrar. Confira o e-mail e a senha ou peça ao administrador para criar seu usuário.');
  }

  if (!supabaseConfigured) return <main className="setup-screen"><section className="login-card"><div className="login-brand"><Wrench/><div><b>AutoManager</b><small>OFICINA PRO</small></div></div><h1>Configuração necessária</h1><p>O aplicativo ainda não está conectado ao Supabase. Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> nas variáveis de ambiente do serviço de hospedagem e no arquivo <code>.env.local</code> para desenvolvimento.</p><p className="login-note"><ShieldCheck size={17}/> Nunca coloque a chave <code>service_role</code> no frontend.</p></section></main>;
  if (loading) return <main className="setup-screen"><div className="login-card"><p>Verificando sessão segura…</p></div></main>;
  if (session) return <App />;

  return <main className="setup-screen"><section className="login-card">
    <div className="login-brand"><div className="login-icon"><Wrench/></div><div><b>AutoManager</b><small>OFICINA PRO</small></div></div>
    <span className="login-eyebrow"><LockKeyhole size={14}/> ACESSO RESTRITO</span>
    <h1>Entre na sua oficina</h1><p className="login-subtitle">Use o e-mail e a senha fornecidos pelo administrador.</p>
    <form onSubmit={signIn} className="login-form">
      <label>E-mail<div className="login-input"><Mail size={17}/><input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@oficina.com.br"/></div></label>
      <label>Senha<div className="login-input"><LockKeyhole size={17}/><input type="password" autoComplete="current-password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha"/></div></label>
      {message && <p role="alert" className="login-error">{message}</p>}
      <button className="primary-btn login-submit" disabled={busy} type="submit"><LogIn size={17}/>{busy?'Verificando…':'Entrar com segurança'}</button>
    </form><p className="login-foot"><ShieldCheck size={15}/> Acesso protegido por autenticação.</p>
  </section></main>;
}
