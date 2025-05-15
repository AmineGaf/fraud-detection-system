import { SidebarProvider } from './components/sidebar/sidebar';
import { SidebarComponent } from './components/ui/SidebarComponent';
import { Header } from './components/ui/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/login';
import { Exams } from './pages/Exams';
import { Users } from './pages/Users';

function App() {
  return (
    <Router>
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-w-full bg-background">
          <SidebarComponent />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            
            <main className="flex-1 p-6 overflow-auto bg-background">
              <div className="max-w-4xl mx-auto">
                <Routes>
                  <Route path="/login" element={<Login />} />
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
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;