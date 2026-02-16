import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { store } from './core/store/store';
import { AppRouter } from './core/router/AppRouter';
import { setTokenGetter, setOnUnauthorized } from './core/api/apiClient';
import { logout } from './modules/auth/store/authSlice';
import './index.css';

function TokenInitializer() {
  setTokenGetter(() => store.getState().auth.token);
  setOnUnauthorized(() => store.dispatch(logout()));
  
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <TokenInitializer />
      <TooltipProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  </StrictMode>
);
