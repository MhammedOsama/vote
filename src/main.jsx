import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'flowbite';

import logo from './assets/finlogo.png';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
    </header>

    <App />

  </React.StrictMode>
);


