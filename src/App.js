import "./App.css";
import React,{ useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import AdvancedControls from "./pages/AdvancedControls.js";
import Admin from "./pages/Admin.js";
import AdminLogin from "./pages/AdminLogin";
import useAuthStore from "./store/useAuthStore.js";
import Phases from "./pages/Phases.js";
import YearOverYear from "./pages/YearOverYear.js";
import usePhases from "./store/usePhases.js";
import Navbar from "./components/Navbar";
import FleetEditor from "./pages/FleetEditor";
import SetDefaults from "./pages/SetDefaults";
import ProtectedRoute from "./components/ProtectedRoute";
import DeleteUser from "./pages/DeleteUser";
import AdminNav from "./components/AdminNav";
import SetInfo from "./pages/SetInfo";
import useProForma from "./store/useProForma";

const MainLayout = ({ children }) => {
  const { user, loading } = useAuthStore();

  const navigate = useNavigate();
  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);



  return (
    <div className="flex w-full">
      <div className="w-[250px] z-50">
        <Navbar className=""/>
      </div>
      <div className=" w-1/2 flex-grow p-10">{children}</div>
    </div>
  );
};


const AdminLayout = ({ children }) => {
  return (
    <div className="w-full">
      <div className="w-full h-[80px] flex items-center justify-center fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <AdminNav />
      </div>
      <div className="pt-[100px] p-10 h-full">
        {children}
      </div>
    </div>
  );
};

function App() {
  const { initializeAuth, user, data } = useAuthStore();
  const { phases } = usePhases();

  const { fetchAndUpdateFleet } = useProForma();

  useEffect(() => {
    fetchAndUpdateFleet();
 }, [user]); 



  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);




  return (
    <div className="flex h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/advanced-controls"
          element={
            <MainLayout>
              <AdvancedControls />
            </MainLayout>
          }
        />
        <Route
          path="/phases"
          element={
            <MainLayout>
              <Phases />
            </MainLayout>
          }
        />
        <Route
          path="/yearoveryear"
          element={
            <MainLayout>
              <YearOverYear />
            </MainLayout>
          }
        />
        <Route
          path="/fleet-editor"
          element={
            <MainLayout>
              <FleetEditor />
            </MainLayout>
          }
        />
        <Route
          path="/set-defaults"
          element={
            <div className="w-full">
              <AdminLayout>
                <SetDefaults />
              </AdminLayout>
            </div>
          }
        />
        <Route
          path="/set-info"
          element={
            <div className="w-full">
              <AdminLayout>
                <SetInfo />
              </AdminLayout>
            </div>
          }
        />
        <Route
          path="/delete-user"
          element={
            <ProtectedRoute route="/delete-user">
              <AdminLayout>
                <DeleteUser />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute route="/admin">
              <AdminLayout>
                <Admin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </div>
  );
}

export default App;
