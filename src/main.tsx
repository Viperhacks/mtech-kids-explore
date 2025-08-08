import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import  {createApiInstance} from './lib/useApi.ts';

function Root() {
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    createApiInstance().then(() => setApiReady(true));
  }, []);

  if (!apiReady) {
    return <div>Loading...</div>; // or a splash screen
  }

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <App />
    </GoogleOAuthProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
