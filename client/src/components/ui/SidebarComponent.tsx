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
import { Users, FileText, LogOut, PanelLeft, BookOpen, Eye, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export const SidebarComponent = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('You have been logged out successfully');
        navigate('/login');
    };

    // Define base menu items
    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: BookOpen, label: "Classes", path: "/classes" },
        { icon: FileText, label: "Exams", path: "/exams" },
    ];

    // Add Users menu item only for admin (role_id = 3)
    if (user?.role_id === 3) {
        menuItems.splice(2, 0, { icon: Users, label: "Users", path: "/users" });
    }

    return (
        <Sidebar className="bg-sidebar border-r border-border shadow-sidebar transition-all duration-300 ease-in-out">
            <SidebarHeader className="p-4 flex flex-row items-center justify-between border-b border-border">
                <Link to="/" className="flex items-center gap-3 group-data-[state=collapsed]/sidebar:justify-center">
                    {/* Modern Logo with Gradient */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition-all duration-300"></div>
                        <div className="relative p-2 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                            <Eye className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>

                    {/* Modern Text Treatment */}
                    <span className="text-xl font-bold group-data-[state=collapsed]/sidebar:hidden flex items-center gap-1">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Exam
                        </span>
                        <span className="text-gray-700">Eye</span>
                    </span>
                </Link>
                <SidebarTrigger className="md:hidden p-1.5 rounded-md hover:bg-accent text-sidebar-foreground transition-colors">
                    <PanelLeft className="w-5 h-5" />
                </SidebarTrigger>
            </SidebarHeader>

            <SidebarContent className='p-4'>
                <SidebarMenu>
                    {menuItems.map((item, index) => (
                        <SidebarMenuItem key={index}>
                            <Link to={item.path} className="w-full">
                                <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent w-full transition-all duration-200 rounded-lg group">
                                    <div className="relative flex items-center gap-3 p-2">
                                        <item.icon className="w-5 h-5 text-sidebar-foreground group-hover:text-sidebar-primary transition-colors" />
                                        <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                                            {item.label}
                                        </span>
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-transparent group-hover:bg-sidebar-primary rounded-r-full transition-all duration-300"></div>
                                    </div>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}

                    <SidebarSeparator className="bg-border my-2" />

                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                            <div
                                onClick={handleLogout}
                                className="w-full cursor-pointer"
                            >
                                <SidebarMenuButton className="group-data-[state=collapsed]/sidebar:justify-center hover:bg-accent w-full transition-all duration-200 rounded-lg group">
                                    <div className="relative flex items-center gap-3 p-2">
                                        <LogOut className="w-5 h-5 text-sidebar-foreground group-hover:text-red-500 transition-colors" />
                                        <span className="group-data-[state=collapsed]/sidebar:hidden text-sidebar-foreground group-hover:text-red-500 transition-colors">
                                            Logout
                                        </span>
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-transparent group-hover:bg-red-500 rounded-r-full transition-all duration-300"></div>
                                    </div>
                                </SidebarMenuButton>
                            </div>
                        </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};