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
  useBulkAssignClass,
  useRemoveFromClass,
  useUpdateUser
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
  const [filters, setFilters] = useState<{ role?: string; class?: string }>({});
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [tableKey, setTableKey] = useState(0);

  const { data: users = [], isLoading: isUsersLoading } = useUsersData();
  const { data: classes = [], isLoading: isClassesLoading } = useClassesData();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();
  const assignClassMutation = useAssignClass();
  const bulkAssignMutation = useBulkAssignClass();
  const updateUserMutation = useUpdateUser();

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = !filters.role || user.role.name === filters.role;
    const matchesClass = !filters.class ||
      user.classes?.some(c => String(c.id) === filters.class);
    return matchesSearch && matchesRole && matchesClass;
  });

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
      console.error("Bulk assignment error:", error);
    }
  };

  const handleEditUser = (userId: number) => {
    setEditingUserId(userId);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (formData: Omit<AddUser, "id"> & { password?: string }) => {
    try {
      if (editingUserId) {
        await updateUserMutation.mutateAsync({
          userId: editingUserId,
          userData: formData
        });
      } else {
        await createUserMutation.mutateAsync(formData);
      }
      setIsDialogOpen(false);
      setEditingUserId(null);
    } catch (error) {
      throw error;
    }
  };

  const removeFromClassMutation = useRemoveFromClass();

  const handleRemoveFromClass = async (userId: number, classId: number) => {
    try {
      await removeFromClassMutation.mutateAsync({ userId, classId });
    } catch (error) {
      console.error("Remove from class error:", error);
    }
  };

  const isLoading = isUsersLoading || isClassesLoading;

  if (isLoading) return (
    <div className="p-6 flex items-center justify-center gap-3 h-[300px]">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-muted-foreground">Loading users and classes...</span>
    </div>
  );

  return (
    <div className="space-y-6 p-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all system users and their permissions
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingUserId(null);
            setTableKey(prev => prev + 1);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm hover:shadow-md transition-shadow">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {editingUserId ? "Edit User" : "Add New User"}
              </DialogTitle>
            </DialogHeader>
            <AddUserForm
              onSubmit={handleSubmit}
              onSuccess={() => {
                setIsDialogOpen(false);
                setEditingUserId(null);
              }}
              isLoading={editingUserId ? updateUserMutation.isPending : createUserMutation.isPending}
              error={editingUserId ? updateUserMutation.error : createUserMutation.error}
              userId={editingUserId}
              isEditMode={!!editingUserId}
              initialData={editingUserId ? users.find((user: User) => user.id === editingUserId) : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
        currentFilters={filters}
        classes={classes}
      />

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <UserTable
          key={`user-table-${tableKey}`}
          users={filteredUsers}
          classes={classes}
          selectedUsers={selectedUsers}
          onSelectUsers={setSelectedUsers}
          onAssign={handleAssignClass}
          onRemove={handleRemoveFromClass}
          onDelete={deleteUserMutation.mutate}
          onEdit={handleEditUser}
          isDeleting={deleteUserMutation.isPending}
          isAssigning={assignClassMutation.isPending}
          isRemoving={removeFromClassMutation.isPending}
          isEditing={updateUserMutation.isPending}
        />
      </div>

      {selectedUsers.length > 0 && (
        <BulkAssignToolbar
          selectedUsers={selectedUsers}
          classes={classes}
          onAssign={handleBulkAssign}
          onCancel={() => setSelectedUsers([])}
          isAssigning={bulkAssignMutation.isPending}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
          <span className="font-medium">{users.length}</span> users
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};