import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react"
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell,
  TableCaption
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { AddUserForm } from "./components/AddUserForm"

// Mock user data - replace with real API calls
const mockUsers = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "Admin", status: "Active", lastLogin: "2023-06-15" },
  { id: 2, name: "Maria Garcia", email: "maria@example.com", role: "Teacher", status: "Active", lastLogin: "2023-06-14" },
  { id: 3, name: "James Smith", email: "james@example.com", role: "Student", status: "Inactive", lastLogin: "2023-05-20" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Teacher", status: "Active", lastLogin: "2023-06-10" },
  { id: 5, name: "David Brown", email: "david@example.com", role: "Student", status: "Pending", lastLogin: "2023-06-01" },
  { id: 6, name: "David Brown", email: "david@example.com", role: "Student", status: "Pending", lastLogin: "2023-06-01" },
  { id: 7, name: "David Brown", email: "david@example.com", role: "Student", status: "Pending", lastLogin: "2023-06-01" },
  { id: 8, name: "David Brown", email: "david@example.com", role: "Student", status: "Pending", lastLogin: "2023-06-01" },
  { id: 9, name: "David Brown", email: "david@example.com", role: "Student", status: "Pending", lastLogin: "2023-06-01" },
]

export const Users = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(mockUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = (newUser: typeof mockUsers[0]) => {
    setUsers([...users, { ...newUser, id: users.length + 1 }])
    setIsDialogOpen(false)
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
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
            {/* <AddUserForm onSubmit={handleAddUser} /> */}
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
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "Admin" 
                        ? "bg-blue-100 text-blue-800" 
                        : user.role === "Teacher" 
                          ? "bg-purple-100 text-purple-800" 
                          : "bg-green-100 text-green-800"
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : user.status === "Pending" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
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

      {/* Pagination would go here */}
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </div>
  )
}

// Add this component in a separate file (components/AddUserForm.tsx)
const AddUserForm = ({ onSubmit }: { onSubmit: (user: any) => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Student",
    status: "Active"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Full Name</label>
        <Input 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter full name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <Input 
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Enter email address"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit">Add User</Button>
      </div>
    </form>
  )
}