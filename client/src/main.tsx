import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/layout/style.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/Routes.tsx';
import { Provider } from 'react-redux';
import { configureTheStore } from './app/store/store.ts';

const store = configureTheStore();

console.log('store => ' , store.getState());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} future={{v7_startTransition:false}}/>
    </Provider>
  </StrictMode>,
)
