import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import ForgotPasswordPage from "./features/auth/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/ResetPasswordPage";
import ProfilePage from "./features/profile/ProfilePage";
import ProductList from "./features/products/ProductList";
import ProductForm from "./features/products/ProductForm";
import ReceiptList from "./features/operations/ReceiptList";
import ReceiptForm from "./features/operations/ReceiptForm";
import DeliveryList from "./features/operations/DeliveryList";
import DeliveryForm from "./features/operations/DeliveryForm";
import TransferList from "./features/operations/TransferList";
import TransferForm from "./features/operations/TransferForm";
import AdjustmentList from "./features/operations/AdjustmentList";
import AdjustmentForm from "./features/operations/AdjustmentForm";
import StockLedger from "./features/ledger/StockLedger";
import Dashboard from "./features/dashboard/Dashboard";
import SettingsPage from "./features/settings/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected app routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/:id/edit" element={<ProductForm />} />
              
              <Route path="/operations/receipts" element={<ReceiptList />} />
              <Route path="/operations/receipts/new" element={<ReceiptForm />} />
              <Route path="/operations/receipts/:id" element={<ReceiptForm />} />
              
              <Route path="/operations/deliveries" element={<DeliveryList />} />
              <Route path="/operations/deliveries/new" element={<DeliveryForm />} />
              <Route path="/operations/deliveries/:id" element={<DeliveryForm />} />
              
              <Route path="/operations/transfers" element={<TransferList />} />
              <Route path="/operations/transfers/new" element={<TransferForm />} />
              <Route path="/operations/transfers/:id" element={<TransferForm />} />
              
              <Route path="/operations/adjustments" element={<AdjustmentList />} />
              <Route path="/operations/adjustments/new" element={<AdjustmentForm />} />
              <Route path="/operations/adjustments/:id" element={<AdjustmentForm />} />
              
              <Route path="/ledger" element={<StockLedger />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/" element={<Dashboard />} />
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
