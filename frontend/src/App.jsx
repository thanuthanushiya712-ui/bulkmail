import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Mailpage from "./components/Mailpage";
import History from "./components/History";
import Header from "./components/Header";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="login-screen min-h-screen overflow-hidden bg-[#030817] text-slate-100">
            <div className="mesh-bg" />
            <Login onLogin={() => navigate("/send-mail")} />
          </div>
        }
      />

      <Route
        path="/send-mail"
        element={
          <ProtectedRoute>
            <div className="page-shell">
              <div className="orb orb-one" />
              <div className="orb orb-two" />
              <Header />
              <main className="relative z-10"><Mailpage /></main>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <div className="page-shell">
              <div className="orb orb-one" />
              <div className="orb orb-two" />
              <Header />
              <main className="relative z-10"><History /></main>
            </div>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/send-mail" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
