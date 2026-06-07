import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Loader } from './components/common';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Lazy load pages
const GalleryPage = React.lazy(() => import('./pages/GalleryPage'));
const ArtworkDetailPage = React.lazy(() => import('./pages/ArtworkDetailPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const OrderDetailPage = React.lazy(() => import('./pages/OrderDetailPage'));
const CoursesListingPage = React.lazy(() => import('./pages/CoursesListingPage'));
const CourseDetailPage = React.lazy(() => import('./pages/CourseDetailPage'));
const LessonPage = React.lazy(() => import('./pages/LessonPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage'));
const AdminArtworksPage = React.lazy(() => import('./pages/admin/AdminArtworksPage'));
const AdminCoursesPage = React.lazy(() => import('./pages/admin/AdminCoursesPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminAnnouncementsPage = React.lazy(() => import('./pages/admin/AdminAnnouncementsPage'));
const AdminCategoriesPage = React.lazy(() => import('./pages/admin/AdminCategoriesPage'));

import './styles/theme.css';

/** Layout wrapper with Header + Footer */
function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader /></div>}>
          <Outlet />
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}

/** Protected route wrapper — redirects to /login if unauthenticated */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

/** Admin route wrapper */
function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-primary)',
              fontSize: '0.9375rem',
            },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<GalleryPage />} />
            <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/courses" element={<CoursesListingPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />

            {/* Protected routes */}
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders/:id/confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
            <Route path="/admin/artworks" element={<AdminRoute><AdminArtworksPage /></AdminRoute>} />
            <Route path="/admin/courses" element={<AdminRoute><AdminCoursesPage /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
            <Route path="/admin/announcements" element={<AdminRoute><AdminAnnouncementsPage /></AdminRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
