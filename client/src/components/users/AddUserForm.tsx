import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUserForm } from "@/hooks/useUsers";
import type { AddUserFormProps } from "@/types/users";

export const AddUserForm = ({
    onSubmit,
    onSuccess,
    isLoading,
    error
}: AddUserFormProps) => {
    const { form, handleSubmit, handleChange } = useUserForm(async (formData) => {
        await onSubmit(formData);
        onSuccess();
    });

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
                    <option value="2">Teacher</option>
                    <option value="3">Admin</option>
                </select>
            </div>

            {form.role_id !== 1 && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Password</label>
                    <Input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required={form.role_id !== 1}
                    />
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add User"}
                </Button>
            </div>
        </form>
    );
};