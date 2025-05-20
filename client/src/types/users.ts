export type Class = {
    id: number;
    name: string;
    studying_program: string;
    year: number;
    capacity: number;
    description: string;
    is_active: boolean;
    created_at: string;
};

export type User = {
    id: number;
    email: string;
    full_name: string;
    institutional_id?: string;
    role: {
        id: number;
        name: string;
    };
    classes?: Class[];
};

export type AddUser = {
    id: number;
    full_name: string;
    email: string;
    institutional_id?: string;
    role_id: number;
};

export interface AddUserFormProps {
    onSubmit: (user: Omit<AddUser, "id"> & { password?: string }) => Promise<void>;
    onSuccess: () => void;
    isLoading: boolean;
    error: unknown;
}

