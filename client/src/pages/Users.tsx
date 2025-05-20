import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useUsersData,
  useCreateUser,
  useDeleteUser,
  useClassesData,
  useAssignClass,
  useBulkAssignClass
} from "@/hooks/useUsers";
import { AddUserForm } from "@/components/users/AddUserForm";
import { UserTable } from "@/components/users/UserTable";
import { SearchBar } from "@/components/users/SearchBar";
import { BulkAssignToolbar } from "@/components/users/BulkAssignToolbar";
import type { AddUser, User } from "@/types/users";

export const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Fetch data with improved loading states
  const { data: users = [], isLoading: isUsersLoading } = useUsersData();
  const { data: classes = [], isLoading: isClassesLoading } = useClassesData();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();
  const assignClassMutation = useAssignClass();
  const bulkAssignMutation = useBulkAssignClass();

  const filteredUsers = users.filter(
    (user: User) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = async (newUser: Omit<AddUser, "id"> & { password?: string }) => {
    try {
      await createUserMutation.mutateAsync(newUser);
      setIsDialogOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleAssignClass = async (userId: number, classId: number) => {
    try {
      await assignClassMutation.mutateAsync({ userId, classId });
    } catch (error) {
      console.error("Assignment error:", error);
    }
  };

  const handleBulkAssign = async (classId: number) => {
    try {
      const result = await bulkAssignMutation.mutateAsync({
        userIds: selectedUsers,
        classId
      });
      if (result.success) {
        setSelectedUsers([]);
      }
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  // Combine loading states
  const isLoading = isUsersLoading || isClassesLoading;

  if (isLoading) return (
    <div className="p-4 flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading users and classes...
    </div>
  );

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
            <AddUserForm
              onSubmit={handleAddUser}
              onSuccess={() => setIsDialogOpen(false)}
              isLoading={createUserMutation.isPending}
              error={createUserMutation.error}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <UserTable
        users={filteredUsers}
        classes={classes}
        selectedUsers={selectedUsers}
        onSelectUsers={setSelectedUsers}
        onAssign={handleAssignClass}
        onDelete={deleteUserMutation.mutate}
        isDeleting={deleteUserMutation.isPending}
        isAssigning={assignClassMutation.isPending}
      />

      {selectedUsers.length > 0 && (
        <BulkAssignToolbar
          selectedUsers={selectedUsers}
          classes={classes}
          onAssign={handleBulkAssign}
          onCancel={() => setSelectedUsers([])}
          isAssigning={bulkAssignMutation.isPending}
        />
      )}

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