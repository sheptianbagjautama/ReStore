import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/layout/style.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { router } from './app/routes/Routes.tsx';
import { store } from './app/store/store.ts';

// //Reduc Core yang dulu
// const storeLegacy = configureTheStore();
// console.log('store => ' , storeLegacy.getState());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> 
    <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
    <RouterProvider router={router} future={{v7_startTransition:false}}/>
    </Provider>
  </StrictMode>,
)
