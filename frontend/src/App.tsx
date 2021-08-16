import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import { apiFetch } from "./utils/api";
import { FlashMessage, User } from "./types";
import Dashboard from "./components/dashboard/Dashboard";
import { DashboardContextProvider } from "./contexts/DashboardContext";
import Profil from "./components/Profil";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Scans from "./components/scans/Scans";
import CreateScan from "./components/scans/CreateScan";
import ScanDetails from "./components/scans/Scan";
import { ScanContextProvider } from "./contexts/ScanContext";
import EmailConfirm from "./components/auth/EmailConfirm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ResetPasswordConfirmForm from "./components/auth/ResetPasswordConfirmForm";
import Notifications from "./components/Notifications";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  // @ts-ignore
  const [user, setUser] = useState<User>(null);
  // @ts-ignore
  const [flashMessages, setFlashMessages] = useState<FlashMessage>(null);
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
        setUser(null);
      }
    })();
  }, [onConnect]);

  return (
    <div className="page-wrapper">
      <Router>
        <Header user={user} connect={onConnect} onConnect={setOnConnect} />
        <Switch>
          <Route exact path="/">
            <Home user={user} />
            <Footer />
          </Route>
          <PrivateRoute user={user} path="/scans/nouveau">
            <CreateScan user={user} setFlashMessages={setFlashMessages} />
            <Footer />
          </PrivateRoute>
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
          <PrivateRoute user={user} path="/profil">
            <Profil user={user} />
            <Footer />
          </PrivateRoute>
          <Route exact path="/inscription">
            {onConnect ? <Redirect to="/" /> : <RegisterForm />}
          </Route>
          <Route exact path="/connexion">
            {onConnect ? (
              <Redirect to="/" />
            ) : (
              <LoginForm
                onConnect={setOnConnect}
                flashMessages={flashMessages}
                setFlashMessages={setFlashMessages}
              />
            )}
          </Route>
          <Route exact path="/notifications">
            <Notifications />
          </Route>
          <PrivateRoute
            user={user}
            requiredRoles={["ROLE_ADMIN", "ROLE_SUPERADMIN"]}
            path="/administration"
          >
            <DashboardContextProvider>
              <Dashboard />
            </DashboardContextProvider>
          </PrivateRoute>
          <Route exact path="/inscription/confirmation/:id">
            <EmailConfirm setFlashMessages={setFlashMessages} />
          </Route>
          <Route exact path="/password/nouveau">
            <ForgotPasswordForm
              flashMessages={flashMessages}
              setFlashMessages={setFlashMessages}
            />
          </Route>
          <Route exact path="/password/nouveau/:id">
            <ResetPasswordConfirmForm
              flashMessages={flashMessages}
              setFlashMessages={setFlashMessages}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
