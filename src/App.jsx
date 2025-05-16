
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Toaster } from '@/components/ui/toaster';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'));
const UserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const UploadCoursePage = lazy(() => import('@/pages/UploadCoursePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/upload-course" element={
              <ProtectedRoute adminOnly={true}>
                <UploadCoursePage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
  