import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import RequestResetPage from "./features/auth/RequestResetPage";
import ResetPasswordPage from "./features/auth/ResetPasswordPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import ProfilePage from "./features/profile/ProfilePage";
import ProductList from "./features/products/ProductList";
import ProductForm from "./features/products/ProductForm";
import ReceiptList from "./features/operations/ReceiptList";
import ReceiptForm from "./features/operations/ReceiptForm";
import DeliveryList from "./features/operations/DeliveryList";
import DeliveryForm from "./features/operations/DeliveryForm";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset/request" element={<RequestResetPage />} />
          <Route path="/reset/verify" element={<ResetPasswordPage />} />

          {/* Protected app routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Placeholder routes for upcoming modules */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/:id/edit" element={<ProductForm />} />
              <Route path="/operations/receipts" element={<ReceiptList />} />
              <Route path="/operations/receipts/new" element={<ReceiptForm />} />
              <Route path="/operations/receipts/:id" element={<ReceiptForm />} />
              <Route path="/operations/deliveries" element={<DeliveryList />} />
              <Route path="/operations/deliveries/new" element={<DeliveryForm />} />
              <Route path="/operations/deliveries/:id" element={<DeliveryForm />} />
              <Route
                path="/operations/transfers"
                element={
                  <div className="page">
                    <h1>Internal Transfers (coming soon)</h1>
                  </div>
                }
              />
              <Route
                path="/operations/adjustments"
                element={
                  <div className="page">
                    <h1>Inventory Adjustments (coming soon)</h1>
                  </div>
                }
              />
              <Route
                path="/ledger"
                element={
                  <div className="page">
                    <h1>Move History (coming soon)</h1>
                  </div>
                }
              />
              <Route
                path="/settings/warehouses"
                element={
                  <div className="page">
                    <h1>Warehouses & Locations (coming soon)</h1>
                  </div>
                }
              />
            </Route>
          </Route>

          {/* Default route */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
