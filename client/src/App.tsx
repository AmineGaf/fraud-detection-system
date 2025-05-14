import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator
} from './components/ui/sidebar';
import { Home, Settings, Users, FileText, LogOut, PanelLeft } from 'lucide-react';

function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-w-full bg-background">
        <Sidebar className="bg-sidebar border border-border shadow-sm">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-sidebar-foreground group-data-[state=collapsed]/sidebar:hidden">
              My App
            </h1>
            <SidebarTrigger className="md:hidden p-1 rounded-md hover:bg-accent text-sidebar-foreground">
              <PanelLeft className="w-5 h-5" />
            </SidebarTrigger>
          </SidebarHeader>

          <SidebarContent className='p-4'>
            <SidebarMenu>
              {[
                { icon: Home, label: "Dashboard" },
                { icon: Users, label: "Users" },
                { icon: FileText, label: "Exams" },
              ].map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent">
                    <item.icon className="w-4 h-4 text-sidebar-foreground" /> 
                    <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarSeparator className="bg-border" />

              <SidebarMenuItem>
                <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent">
                  <LogOut className="w-4 h-4 text-sidebar-foreground" />
                  <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground">
                    Logout
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent">
                  <Settings className="w-4 h-4 text-sidebar-foreground" />
                  <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground">
                    Settings
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-card border-b border-border p-4 flex items-center shadow-sm">
            <SidebarTrigger className="mr-4 p-2 rounded-md hover:bg-accent text-foreground">
              <PanelLeft className="w-5 h-5" />
            </SidebarTrigger>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </header>

          <main className="flex-1 p-6 overflow-auto bg-background">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Welcome</h2>
              <div className="bg-card p-6 rounded-lg shadow border border-border">
                <p className="text-foreground">
                  This is your main content area.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default App;