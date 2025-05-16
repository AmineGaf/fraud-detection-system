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
              <Route element={<PrivateRoute />}>
                <Route path="/exams" element={<Exams />} />
                <Route path="/users" element={<Users />} />
                <Route path="/" element={
                  <>
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Welcome</h2>
                    <div className="bg-card p-6 rounded-lg shadow border border-border">
                      <p className="text-foreground">
                        This is your main content area.
                      </p>
                    </div>
                  </>
                } />
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