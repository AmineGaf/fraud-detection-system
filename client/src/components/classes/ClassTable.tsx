import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2, User } from "lucide-react";
import type { Class } from "@/types/classes";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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

  const handleEdit = (classId: number) => {
    setOpenDropdownId(null);
    onEdit(classId);
  };

  const handleViewUsers = (cls: Class) => {
    setSelectedClass(cls);
    setViewUsersDialogOpen(true);
    setOpenDropdownId(null);
  };

  return (
    <Table className="border-collapse">
      <TableHeader className="bg-muted/30">
        <TableRow className="hover:bg-muted/30">
          <TableHead className="w-[40px] px-4">
            <Checkbox
              checked={selectedClasses.length === classes.length && classes.length > 0}
              onCheckedChange={(checked) => {
                onSelectClasses(checked ? classes.map(cls => cls.id) : []);
              }}
              className="border-muted-foreground/30"
            />
          </TableHead>
          <TableHead className="w-[200px] px-4">Name</TableHead>
          <TableHead className="px-4">Program</TableHead>
          <TableHead className="px-4">Year</TableHead>
          <TableHead className="px-4">Capacity</TableHead>
          <TableHead className="px-4">Status</TableHead>
          <TableHead className="text-right px-4">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.length > 0 ? (
          classes.map((cls) => (
            <TableRow key={cls.id} className="hover:bg-muted/10 border-t border-muted/20">
              <TableCell className="px-4">
                <Checkbox
                  checked={selectedClasses.includes(cls.id)}
                  onCheckedChange={(checked) => {
                    const newSelection = checked
                      ? [...selectedClasses, cls.id]
                      : selectedClasses.filter(id => id !== cls.id);
                    onSelectClasses(newSelection);
                  }}
                  className="border-muted-foreground/30"
                />
              </TableCell>
              <TableCell className="font-medium px-4">
                <span className="font-medium text-foreground">{cls.name}</span>
              </TableCell>
              <TableCell className="px-4 text-muted-foreground">
                {cls.studying_program}
              </TableCell>
              <TableCell className="px-4">{cls.year}</TableCell>
              <TableCell className="px-4">{cls.capacity}</TableCell>
              <TableCell className="px-4">
                <Badge
                  variant="outline"
                  className={
                    cls.is_active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }
                >
                  {cls.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right px-4">
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-muted/50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleEdit(cls.id)}
                      disabled={isEditing}
                      className="px-3 py-2"
                    >
                      {isEditing ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleViewUsers(cls)}
                      className="px-3 py-2"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Users
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      className="text-destructive px-3 py-2 focus:text-destructive"
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
            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground py-8">
              No classes found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      
      <Dialog open={viewUsersDialogOpen} onOpenChange={setViewUsersDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Users in <span className="text-primary">{selectedClass?.name}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedClass?.users && selectedClass.users.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 font-medium text-sm text-muted-foreground border-b pb-2 px-1">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Joined At</div>
              </div>
              {selectedClass.users.map((user) => (
                <div key={user.id} className="grid grid-cols-4 gap-4 py-2 border-b px-1">
                  <div className="font-medium">{user.full_name}</div>
                  <div className="text-muted-foreground truncate">{user.email}</div>
                  <div>
                    <Badge 
                      variant="outline"
                      className={
                        user.is_professor 
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }
                    >
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
    </Table>
  );
};