import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./context/userContext";
import './main.css'
import {GlobalErrorBoundary} from "./components/GlobalErrorBoundary";
import {ErrorProvider} from "./context/errorContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <BrowserRouter>
          <ErrorProvider>
              <UserProvider>
                  <GlobalErrorBoundary>
                      <App/>
                  </GlobalErrorBoundary>
              </UserProvider>
          </ErrorProvider>
      </BrowserRouter>
);

