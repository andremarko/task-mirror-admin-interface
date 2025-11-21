import React, { useEffect } from "react";
import Homepage from "./pages/Homepage/Homepage";
import { ChakraProvider } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { theme } from "./theme/theme";
import Usuarios from "./pages/Usuarios/Usuarios";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/usuarios": "Usuários",
  "/login": "Login",
};

function TitleUpdater() {
  const location = useLocation();
  useEffect(() => {
    const title = pageTitles[location.pathname] || "TaskMirror";
    document.title = `${title} - TaskMirror`;
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <TitleUpdater />
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Homepage />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/usuarios"
              element={
                <PrivateRoute>
                  <Usuarios />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
