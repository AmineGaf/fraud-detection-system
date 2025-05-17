import { SidebarTrigger } from '../sidebar/sidebar';
import { PanelLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/exams': 'Exams',
  '/login': 'Login',
  '/classes': 'classes',
};

export const Header = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    return routeTitles[location.pathname] || 'Dashboard';
  };

  return (
    <header className="bg-card border-b border-border p-4 flex items-center shadow-sm">
      <SidebarTrigger className="mr-4 p-2 rounded-md hover:bg-accent text-foreground">
        <PanelLeft className="w-5 h-5" />
      </SidebarTrigger>
      <h1 className="text-xl font-semibold text-foreground">
        {getPageTitle()}
      </h1>
    </header>
  );
};