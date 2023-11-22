import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./context/userContext";
import './main.css'
import {GlobalErrorBoundary} from "./components/GlobalErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <BrowserRouter>
          <UserProvider>
              <GlobalErrorBoundary>
                  <App/>
              </GlobalErrorBoundary>
          </UserProvider>
      </BrowserRouter>
);

