import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUserForm } from "@/hooks/useUsers";
import type { AddUserFormProps } from "@/types/users";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const AddUserForm = ({
    onSubmit,
    onSuccess,
    isLoading,
    error,
    userId,
    isEditMode = false,
    initialData
}: AddUserFormProps) => {
    const { form, handleSubmit, handleChange, setForm } = useUserForm(async (formData) => {
        await onSubmit(formData);
        onSuccess();
    });

    // Load user data if in edit mode
    useEffect(() => {
        if (isEditMode && initialData) {
            setForm({
                full_name: initialData.full_name,
                email: initialData.email,
                institutional_id: initialData.institutional_id || '',
                role_id: initialData.role.id,
                password: '' // Don't pre-fill password
            });
        }
    }, [isEditMode, initialData, setForm]);

    const errorMessage = error instanceof Error
        ? error.message
        : typeof error === 'string'
            ? error
            : "An error occurred";

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {error as string && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium">Full Name</label>
                <Input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Email</label>
                <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Institutional ID</label>
                <Input
                    name="institutional_id"
                    value={form.institutional_id}
                    onChange={handleChange}
                    placeholder="Enter institutional ID"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Role</label>
                <select
                    name="role_id"
                    value={form.role_id}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <option value="1">Student</option>
                    <option value="2">Supervisor</option>
                    <option value="3">Admin</option>
                </select>
            </div>

            {form.role_id !== 1 && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        {isEditMode ? "New Password (leave blank to keep current)" : "Password"}
                    </label>
                    <Input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder={isEditMode ? "Enter new password" : "Enter password"}
                        required={!isEditMode && form.role_id !== 1}
                    />
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {isEditMode ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        isEditMode ? "Update User" : "Add User"
                    )}
                </Button>
            </div>
        </form>
    );
};