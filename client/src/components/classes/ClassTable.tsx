import { useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import type { Class } from "@/types/classes";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { User } from "lucide-react"; 

interface ClassTableProps {
    classes: Class[];
    selectedClasses: number[];
    onSelectClasses: (ids: number[]) => void;
    onDelete: (classId: number) => void;
    onEdit: (classId: number) => void;
    isDeleting: boolean;
    isEditing?: boolean;
}

export const ClassTable = ({
    classes,
    selectedClasses,
    onSelectClasses,
    onDelete,
    onEdit,
    isDeleting,
    isEditing,
}: ClassTableProps) => {
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [viewUsersDialogOpen, setViewUsersDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    console.log(classes)

    const handleEdit = (classId: number) => {
        setOpenDropdownId(null);
        onEdit(classId);
    };

    const handleViewUsers = (cls: Class) => {
        setSelectedClass(cls);
        console.log(cls)
        setViewUsersDialogOpen(true);
        setOpenDropdownId(null);
    };

    return (
        <div className="rounded-lg border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[40px]">
                            <Checkbox
                                checked={selectedClasses.length === classes.length && classes.length > 0}
                                onCheckedChange={(checked) => {
                                    onSelectClasses(checked ? classes.map(cls => cls.id) : []);
                                }}
                            />
                        </TableHead>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {classes.length > 0 ? (
                        classes.map((cls) => (
                            <TableRow key={cls.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedClasses.includes(cls.id)}
                                        onCheckedChange={(checked) => {
                                            const newSelection = checked
                                                ? [...selectedClasses, cls.id]
                                                : selectedClasses.filter(id => id !== cls.id);
                                            onSelectClasses(newSelection);
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{cls.name}</TableCell>
                                <TableCell>{cls.studying_program}</TableCell>
                                <TableCell>{cls.year}</TableCell>
                                <TableCell>{cls.capacity}</TableCell>
                                <TableCell>
                                    <Badge variant={cls.is_active ? "default" : "outline"}>
                                        {cls.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu
                                        open={openDropdownId === cls.id}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                setOpenDropdownId(cls.id);
                                            } else {
                                                setOpenDropdownId(null);
                                            }
                                        }}
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => handleEdit(cls.id)}
                                                disabled={isEditing}
                                            >
                                                {isEditing ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : null}
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleViewUsers(cls)}
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                View Users
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => {
                                                    setOpenDropdownId(null);
                                                    onDelete(cls.id);
                                                }}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : null}
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No classes found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableCaption>
                    Showing {classes.length} of {classes.length} classes
                </TableCaption>
            </Table>
            <Dialog open={viewUsersDialogOpen} onOpenChange={setViewUsersDialogOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Users in {selectedClass?.name}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedClass?.users && selectedClass.users.length > 0 ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-2">
                                <div>Name</div>
                                <div>Email</div>
                                <div>Role</div>
                                <div>Joined At</div>
                            </div>
                            {selectedClass.users.map((user) => (
                                <div key={user.id} className="grid grid-cols-4 gap-4 py-2 border-b">
                                    <div>{user.full_name}</div>
                                    <div className="text-muted-foreground">{user.email}</div>
                                    <div>
                                        <Badge variant={user.is_professor ? "default" : "secondary"}>
                                            {user.is_professor ? "Supervisor" : "Student"}
                                        </Badge>
                                    </div>
                                    <div className="text-muted-foreground text-sm">
                                        {new Date(user.joined_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No users assigned to this class
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};