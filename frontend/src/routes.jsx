import { Routes, Route } from "react-router-dom";
import App from "./App";
import ContactView from "./views/ContactView";
import SupportView from "./views/SupportView";
import AproposView from "./views/AproposView";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import MessageView from "./views/MessageView";
import Dashboard from "./components/user/dashboard";
import Profile from "./components/user/profile";
import Messages from "./components/user/Messages";
import Actualite from "./components/user/actuality";
import AdminDashboard from "./components/admin/AdminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/contact" element={<ContactView />} />
      <Route path="/support" element={<SupportView />} />
      <Route path="/apropos" element={<AproposView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/messages" element={<MessageView />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/:section" element={<Dashboard />} />
      <Route path="/dashboard/actualite" element={<Actualite />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
