import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X, Loader2 } from "lucide-react";
import type { Class, User } from "@/types/users";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "../ui/checkbox";
import { AssignClassPopover } from "./AssignClassPopover";
import { useState } from "react";

interface UserTableProps {
  users: User[];
  classes: Class[];
  selectedUsers: number[];
  onSelectUsers: (ids: number[]) => void;
  onAssign: (userId: number, classId: number) => void;
  onRemove: (userId: number, classId: number) => void;
  onDelete: (userId: number) => void;
  onEdit: (userId: number) => void; // Add this
  isDeleting: boolean;
  isAssigning: boolean;
  isRemoving?: boolean;
  isEditing?: boolean;
}

export const UserTable = ({
  users,
  classes,
  selectedUsers,
  onSelectUsers,
  onAssign,
  onRemove,
  onDelete,
  onEdit,
  isDeleting,
  isAssigning,
  isRemoving = false,
  isEditing,
}: UserTableProps) => {

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);


  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={selectedUsers?.length === users.length && users.length > 0}
                onCheckedChange={(checked) => {
                  onSelectUsers(checked ? users.map(user => user.id) : []);
                }}
              />
            </TableHead>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[400px]">Classes</TableHead>
            <TableHead>institutional_id</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers?.includes(user.id) ?? false}
                    onCheckedChange={(checked) => {
                      const newSelection = checked
                        ? [...(selectedUsers || []), user.id]
                        : (selectedUsers || []).filter(id => id !== user.id);
                      onSelectUsers(newSelection);
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role.name === "Admin"
                        ? "default"
                        : user.role.name === "Teacher"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      user.role.name === "Admin"
                        ? "bg-blue-100 text-blue-800"
                        : user.role.name === "Teacher"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {user.role.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-wrap gap-1">
                      {user.classes?.slice(0, 2).map((classItem) => ( // Only show first 2 classes
                        <Badge
                          key={classItem.id}
                          variant="outline"
                          className="bg-gray-100 flex items-center gap-1"
                        >
                          {classItem.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove(user.id, classItem.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                            disabled={isRemoving}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {user.classes && user.classes?.length > 2 && ( // Show "+X more" if there are additional classes
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Badge variant="outline" className="bg-gray-100 cursor-pointer">
                              +{user.classes.length - 2} more
                            </Badge>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {user.classes?.slice(2).map((classItem) => ( // Show remaining classes in dropdown
                              <DropdownMenuItem
                                key={classItem.id}
                                className="flex items-center justify-between"
                              >
                                <span>{classItem.name}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(user.id, classItem.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 ml-2"
                                  disabled={isRemoving}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <AssignClassPopover
                      userId={user.id}
                      currentClassId={user.classes?.[0]?.id}
                      allClasses={classes}
                      onAssign={onAssign}
                      disabled={isAssigning}
                    />
                  </div>
                </TableCell>
                <TableCell>{user.institutional_id || "-"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu
                    open={openDropdownId === user.id}
                    onOpenChange={(open) => {
                      if (open) {
                        setOpenDropdownId(user.id);
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
                        onClick={() => {
                          onEdit(user.id);
                          setOpenDropdownId(null); 
                        }}
                        disabled={isEditing}
                      >
                        {isEditing ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Edit
                      </DropdownMenuItem>
                      {user.classes && user.classes.length > 0 && (
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Remove from Class
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {user.classes.map((classItem) => (
                              <DropdownMenuItem
                                key={classItem.id}
                                onClick={() => onRemove(user.id, classItem.id)}
                                disabled={isRemoving}
                              >
                                {isRemoving ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                {classItem.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(user.id)}
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
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption>
          Showing {users.length} of {users.length} users
        </TableCaption>
      </Table>
    </div>
  );
};