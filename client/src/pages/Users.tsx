import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type User = {
  id: number;
  full_name: string;
  email: string;
  institutional_id?: string;
  role: {
    name: string;
    id: number
  };
};

type AddUser = {
  id: number;
  full_name: string;
  email: string;
  institutional_id?: string;
  role_id: number;
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/users");
        const data = await res.json();
        const usersWithDefaults = data.map((user: User) => ({
          ...user,
        }));
        setUsers(usersWithDefaults);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = async (newUser: Omit<AddUser, "id"> & { password?: string }) => {
    try {
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      const createdUser = await response.json();
      setUsers([...users, {
        ...createdUser,
        last_login: new Date().toISOString().split('T')[0]
      }]);
      setIsDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Failed to add user:", error);
      return false;
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await fetch(`http://localhost:8000/users/${userId}`, { method: "DELETE" });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all system users and their permissions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <AddUserForm onSubmit={handleAddUser} onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>institutional_id</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role.name === "Admin"
                      ? "bg-blue-100 text-blue-800"
                      : user.role.name === "Teacher"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                      }`}>
                      {user.role.name}
                    </span>
                  </TableCell>
                  <TableCell>{user.institutional_id}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableCaption>
            Showing {filteredUsers.length} of {users.length} users
          </TableCaption>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </div>
  );
};

const AddUserForm = ({
  onSubmit,
  onSuccess
}: {
  onSubmit: (user: Omit<AddUser, "id"> & { password?: string }) => Promise<boolean>;
  onSuccess: () => void;
}) => {
  const [form, setForm] = useState<Omit<AddUser, "id"> & { password?: string }>({
    full_name: "",
    email: "",
    institutional_id: "",
    role_id: 1,
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(form);
    if (success) {
      setForm({
        full_name: "",
        email: "",
        institutional_id: "",
        role_id: 1,
        password: ""
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Full Name</label>
        <Input
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Enter full name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Institutional ID</label>
        <Input
          value={form.institutional_id}
          onChange={(e) => setForm({ ...form, institutional_id: e.target.value })}
          placeholder="Enter institutional ID"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Role</label>
        <select
          value={form.role_id}
          onChange={(e) => {
            setForm({
              ...form,
              role_id: parseInt(e.target.value),
            });
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="1">Student</option>
          <option value="2">Teacher</option>
          <option value="3">Admin</option>
        </select>
      </div>


      {form.role_id !== 1 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Password</label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter password"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit">Add User</Button>
      </div>
    </form>
  );
};