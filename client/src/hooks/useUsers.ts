import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, deleteUser, bulkAssignClass, assignClassToUser, fetchClasses, removeUserFromClass } from "@/api/users";
import { toast } from "sonner";
import { useState } from "react";
import type { AddUser, Class } from "@/types/users";
import axios from "axios";

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
        throw new Error("Full name and email are required");
      }

      if (form.role_id !== 1 && !form.password) {
        throw new Error("Password is required for non-student roles");
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
      throw error;
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
    handleChange,
    setForm // Add this to allow external form updates
  };
};

export const useClassesData = () => {
  return useQuery<Class[], Error>({
    queryKey: ['classes'],
    queryFn: fetchClasses,
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: number; userData: Omit<AddUser, "id"> & { password?: string } }) => {
      const response = await axios.patch(`http://localhost:8000/users/${userId}`, userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};