import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    SidebarSeparator
} from '../sidebar/sidebar';
import { Home, Settings, Users, FileText, LogOut, PanelLeft, BookOpen } from 'lucide-react'; // Added BookOpen icon for Classes
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner'; 

export const SidebarComponent = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('You have been logged out successfully');
        navigate('/login');
    };

    return (
        <Sidebar className="bg-sidebar border border-border shadow-sm">
            <SidebarHeader className="p-4 flex items-center justify-between">
                <Link to="/" className="text-lg font-semibold text-sidebar-foreground group-data-[state=collapsed]/sidebar:hidden">
                    My App
                </Link>
                <SidebarTrigger className="md:hidden p-1 rounded-md hover:bg-accent text-sidebar-foreground">
                    <PanelLeft className="w-5 h-5" />
                </SidebarTrigger>
            </SidebarHeader>

            <SidebarContent className='p-4'>
                <SidebarMenu>
                    {[
                        { icon: Home, label: "Dashboard", path: "/" },
                        { icon: BookOpen, label: "Classes", path: "/classes" }, // Added Classes menu item
                        { icon: Users, label: "Users", path: "/users" },
                        { icon: FileText, label: "Exams", path: "/exams" },
                    ].map((item, index) => (
                        <SidebarMenuItem key={index}>
                            <Link to={item.path} className="w-full">
                                <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent w-full">
                                    <item.icon className="w-4 h-4 text-sidebar-foreground" /> 
                                    <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground">
                                        {item.label}
                                    </span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}

                    <SidebarSeparator className="bg-border" />

                    <SidebarMenuItem>
                        <button
                            onClick={handleLogout}
                            className="w-full"
                        >
                            <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent w-full">
                                <LogOut className="w-4 h-4 text-sidebar-foreground" />
                                <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground">
                                    Logout
                                </span>
                            </SidebarMenuButton>
                        </button>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link to="/settings" className="w-full">
                            <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent w-full">
                                <Settings className="w-4 h-4 text-sidebar-foreground" />
                                <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground">
                                    Settings
                                </span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};