import { SidebarProvider } from './components/sidebar/sidebar';
import { SidebarComponent } from './components/ui/SidebarComponent';
import { Header } from './components/ui/Header';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Login } from './pages/login';
import { Exams } from './pages/Exams';
import { Users } from './pages/Users';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { Classes } from './pages/Classes';
import { ExamDetailsPage } from './components/exams/ExamDetailsPage';
import { Dashboard } from './pages/Dashboard';

function AppLayout() {

  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/reset-password';

  return (
    <div className="flex min-w-full bg-background">
      {!isLoginPage && <SidebarComponent />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoginPage && <Header />}

        <main className="flex-1 p-6 overflow-auto bg-background">
          <div className={isLoginPage ? "w-full" : "max-w-4xl mx-auto"}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />

              {/* Regular protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/exams" element={<Exams />} />
                <Route path='/exams/:examId' element={<ExamDetailsPage />} />
                <Route path="/classes" element={<Classes />} />

              </Route>

              {/* Admin-only protected routes */}
              <Route element={<PrivateRoute requiredRole={3} />}>

                <Route path="/users" element={<Users />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SidebarProvider defaultOpen={false}>
            <AppLayout />
            <Toaster position="top-right" richColors />
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;