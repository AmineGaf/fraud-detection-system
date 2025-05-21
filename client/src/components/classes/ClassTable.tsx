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

    const handleEdit = (classId: number) => {
        setOpenDropdownId(null); // Close dropdown before editing
        onEdit(classId);
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
        </div>
    );
};