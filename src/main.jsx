import '@/styles/index.css';

import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import App from '@/App';

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster position="bottom-center" reverseOrder={false} />
  </>,
);
