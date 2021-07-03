import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import { apiFetch } from "./utils/api";
import { User } from "./types";
import Dashboard from "./components/dashboard/Dashboard";
import { DashboardContextProvider } from "./contexts/DashboardContext";
import Profil from "./components/Profil";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Scans from "./components/scans/Scans";
import CreateScan from "./components/scans/CreateScan";
import ScanDetails from "./components/scans/Scan";
import { ScanContextProvider } from "./contexts/ScanContext";
import EmailConfirm from "./components/EmailConfirm";

export default function App() {
  // @ts-ignore
  const [user, setUser] = useState<User>({});
  const [onConnect, setOnConnect] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const user = await apiFetch("/me");
        if (!user) {
          return;
        }
        setUser(user);
        setOnConnect(true);
      } catch (e) {
        // @ts-ignore
        setUser({});
      }
    })();
  }, [onConnect]);

  return (
    <div className="page-wrapper">
      <Router>
        <Header user={user} connect={onConnect} onConnect={setOnConnect} />
        <Switch>
          <Route exact path="/">
            <Home />
            <Footer />
          </Route>
          <Route exact path="/scans/nouveau">
            <CreateScan />
            <Footer />
          </Route>
          <Route exact path="/scans">
            <Scans />
            <Footer />
          </Route>
          <Route exact path="/scans/:id">
            <ScanContextProvider user={user}>
              <ScanDetails />
            </ScanContextProvider>
            <Footer />
          </Route>
          <Route exact path="/profil">
            <Profil user={user} />
            <Footer />
          </Route>
          <Route exact path="/inscription">
            {onConnect ? <Redirect to="/" /> : <RegisterForm />}
          </Route>
          <Route exact path="/connexion">
            {onConnect ? (
              <Redirect to="/" />
            ) : (
              <LoginForm onConnect={setOnConnect} />
            )}
          </Route>
          <Route exact path="/administration">
            <DashboardContextProvider>
              <Dashboard />
            </DashboardContextProvider>
          </Route>
          <Route exact path="/inscription/confirmation/:id">
            <EmailConfirm />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
