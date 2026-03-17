import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import BachatgatDashboard from './pages/BachatgatDashboard';
import MemberDashboard from './pages/MemberDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Contact from './pages/Contact';

/* Routes where the global header should be hidden (they have own navs) */
const HIDE_HEADER_ROUTES = ['/admin'];

const AppInner = () => {
  const location = useLocation();
  const hideHeader = HIDE_HEADER_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <>
      {!hideHeader && <Header />}
      <main className={hideHeader ? '' : 'py-3'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/bachatgat" element={
            <ProtectedRoute allowedRoles={['Bachatgat']}>
              <BachatgatDashboard />
            </ProtectedRoute>
          } />

          <Route path="/member" element={
            <ProtectedRoute allowedRoles={['Member']}>
              <MemberDashboard />
            </ProtectedRoute>
          } />

          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
