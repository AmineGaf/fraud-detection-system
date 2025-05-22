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
import { Settings, Users, FileText, LogOut, PanelLeft, BookOpen, Eye, LayoutDashboard } from 'lucide-react';
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
        <Sidebar className="bg-sidebar border-r border-border shadow-sm">
            <SidebarHeader className="p-4 flex flex-row items-center justify-between border-b border-border">
                <Link to="/" className="flex items-center gap-3 group-data-[state=collapsed]/sidebar:justify-center">
                    {/* Enhanced Logo Container */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-200"></div>
                        <div className="p-2 border-2 border-indigo-400 rounded-lg flex items-center justify-center">
                            <Eye className="w-5 h-5 text-indigo-500" />
                        </div>
                    </div>

                    {/* Enhanced Text Treatment */}
                    <span className="text-xl font-bold text-gray-900 dark:text-white group-data-[state=collapsed]/sidebar:hidden flex items-center gap-1">
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Exam
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">Eye</span>
                    </span>
                </Link>
                <SidebarTrigger className="md:hidden p-1 rounded-md hover:bg-accent text-sidebar-foreground">
                    <PanelLeft className="w-5 h-5" />
                </SidebarTrigger>
            </SidebarHeader>

            {/* Rest of your sidebar content remains the same */}
            <SidebarContent className='p-4'>
                <SidebarMenu>
                    {[
                        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
                        { icon: BookOpen, label: "Classes", path: "/classes" },
                        { icon: Users, label: "Users", path: "/users" },
                        { icon: FileText, label: "Exams", path: "/exams" },
                    ].map((item, index) => (
                        <SidebarMenuItem key={index}>
                            <Link to={item.path} className="w-full">
                                <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent w-full transition-colors duration-150">
                                    <item.icon className="w-5 h-5 text-sidebar-foreground" />
                                    <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground">
                                        {item.label}
                                    </span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}

                    <SidebarSeparator className="bg-border" />

                    <SidebarMenuItem>
                        <div
                            onClick={handleLogout}
                            className="w-full cursor-pointer"
                        >
                            <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent w-full transition-colors duration-150">
                                <LogOut className="w-5 h-5 text-sidebar-foreground" />
                                <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground">
                                    Logout
                                </span>
                            </SidebarMenuButton>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link to="/settings" className="w-full">
                            <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent w-full transition-colors duration-150">
                                <Settings className="w-5 h-5 text-sidebar-foreground" />
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