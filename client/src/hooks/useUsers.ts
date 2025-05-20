import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, deleteUser, bulkAssignClass, assignClassToUser, fetchClasses, removeUserFromClass } from "@/api/users";
import { toast } from "sonner";
import { useState } from "react";
import type { AddUser, Class } from "@/types/users";

export const useUsersData = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

export const useUserForm = (onSubmit: (formData: Omit<AddUser, "id"> & { password?: string }) => Promise<void>) => {
  const [form, setForm] = useState<Omit<AddUser, "id"> & { password?: string }>({
    full_name: "",
    email: "",
    institutional_id: "",
    role_id: 1,
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!form.full_name || !form.email) {
        toast.error("Full name and email are required");
        return;
      }

      if (form.role_id !== 1 && !form.password) {
        toast.error("Password is required for non-student roles");
        return;
      }

      await onSubmit(form);

      setForm({
        full_name: "",
        email: "",
        institutional_id: "",
        role_id: 1,
        password: ""
      });
    } catch (error) {
      throw error
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm(prev => {
      if (name === "role_id") {
        return {
          ...prev,
          role_id: parseInt(value),
          password: value === "1" ? "" : prev.password
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  return {
    form,
    handleSubmit,
    handleChange
  };
};

// Add these to your existing hooks
export const useClassesData = () => {
  return useQuery<Class[]>({ 
    queryKey: ['classes'],
    queryFn: fetchClasses,
    onError: (error: Error) => {
      toast.error("Failed to load classes: " + error.message);
    }
  });
};

export const useAssignClass = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },  // Response type
    Error,                // Error type
    { userId: number; classId: number }  // Variables type
  >({
    mutationFn: assignClassToUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User assigned to class successfully");
    },
    onError: (error: Error) => {
      toast.error("Assignment failed: " + error.message);
    }
  });
};

export const useBulkAssignClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkAssignClass,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success(`Successfully assigned ${data.count} users`);
    },
    onError: (error: Error) => {
      if (error.message.includes("validation error")) {
        toast.error("Invalid data format for bulk assignment");
      } else if (error.message.includes("Student can only be assigned")) {
        toast.error("Cannot assign students to multiple classes");
      } else {
        toast.error("Bulk assignment failed: " + error.message);
      }
    }
  });
};

export const useRemoveFromClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeUserFromClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success("User removed from class successfully");
    },
    onError: (error: Error) => {
      if (error.message.includes("User not found")) {
        toast.error("User not found");
      } else if (error.message.includes("Class not found")) {
        toast.error("Class not found");
      } else {
        toast.error("Failed to remove user from class: " + error.message);
      }
    }
  });
};
