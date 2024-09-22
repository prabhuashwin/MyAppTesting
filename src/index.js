import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import AuthProvider from './context/AuthProvider'; // Default import, no curly braces
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
