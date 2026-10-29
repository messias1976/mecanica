import React from 'react';
import { createRoot } from 'react-dom/client';
import AuthGate from './AuthGate.jsx';
import './styles.css';

class StartupErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('AutoManager startup error:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="setup-screen">
          <section className="login-card" role="alert">
            <h1>Não foi possível abrir o AutoManager</h1>
            <p>O aplicativo encontrou um erro ao iniciar. Recarregue a página. Se o problema continuar, envie esta mensagem ao suporte:</p>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: '#ffb4b4', fontSize: 12 }}>
              {this.state.error?.message || 'Erro inesperado ao iniciar.'}
            </pre>
            <button className="primary-btn" onClick={() => window.location.reload()}>Recarregar aplicativo</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StartupErrorBoundary>
      <AuthGate />
    </StartupErrorBoundary>
  </React.StrictMode>
);
