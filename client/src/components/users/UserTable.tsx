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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator
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
  onEdit: (userId: number) => void;
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
    <Table className="border-collapse">
      <TableHeader className="bg-muted/30">
        <TableRow className="hover:bg-muted/30">
          <TableHead className="w-[40px] px-4">
            <Checkbox
              checked={selectedUsers?.length === users.length && users.length > 0}
              onCheckedChange={(checked) => {
                onSelectUsers(checked ? users.map(user => user.id) : []);
              }}
              className="border-muted-foreground/30"
            />
          </TableHead>
          <TableHead className="w-[200px] px-4">Name</TableHead>
          <TableHead className="px-4">Email</TableHead>
          <TableHead className="px-4">Role</TableHead>
          <TableHead className="w-[400px] px-4">Classes</TableHead>
          <TableHead className="px-4">ID</TableHead>
          <TableHead className="text-right px-4">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/10 border-t border-muted/20">
              <TableCell className="px-4">
                <Checkbox
                  checked={selectedUsers?.includes(user.id) ?? false}
                  onCheckedChange={(checked) => {
                    const newSelection = checked
                      ? [...(selectedUsers || []), user.id]
                      : (selectedUsers || []).filter(id => id !== user.id);
                    onSelectUsers(newSelection);
                  }}
                  className="border-muted-foreground/30"
                />
              </TableCell>
              <TableCell className="font-medium px-4">
                <span className="font-medium text-foreground">{user.full_name}</span>
              </TableCell>
              <TableCell className="px-4 text-muted-foreground">
                {user.email || "-"}
              </TableCell>
              <TableCell className="px-4">
                <Badge
                  variant="outline"
                  className={
                    user.role.name === "Admin"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : user.role.name === "Teacher"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }
                >
                  {user.role.name}
                </Badge>
              </TableCell>
              <TableCell className="px-4">
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-2">
                    {user.classes?.slice(0, 2).map((classItem) => (
                      <Badge
                        key={classItem.id}
                        variant="outline"
                        className="bg-gray-50 flex items-center gap-1.5 px-2.5 py-1 rounded-full border-gray-200"
                      >
                        <span className="max-w-[120px] truncate">{classItem.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(user.id, classItem.id);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          disabled={isRemoving}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {user.classes && user.classes?.length > 2 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className="bg-gray-50 cursor-pointer px-2.5 py-1 rounded-full border-gray-200"
                          >
                            +{user.classes.length - 2} more
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[180px]">
                          {user.classes?.slice(2).map((classItem) => (
                            <DropdownMenuItem
                              key={classItem.id}
                              className="flex items-center justify-between px-3 py-2"
                            >
                              <span className="truncate max-w-[140px]">{classItem.name}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemove(user.id, classItem.id);
                                }}
                                className="text-red-500 hover:text-red-700 ml-2 transition-colors"
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
              <TableCell className="px-4 text-muted-foreground">
                {user.institutional_id || "-"}
              </TableCell>
              <TableCell className="text-right px-4">
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
                      onClick={() => {
                        onEdit(user.id);
                        setOpenDropdownId(null); 
                      }}
                      disabled={isEditing}
                      className="px-3 py-2"
                    >
                      {isEditing ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Edit
                    </DropdownMenuItem>
                    {user.classes && user.classes.length > 0 && (
                      <>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="px-3 py-2">
                            Remove from Class
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-48">
                            {user.classes.map((classItem) => (
                              <DropdownMenuItem
                                key={classItem.id}
                                onClick={() => onRemove(user.id, classItem.id)}
                                disabled={isRemoving}
                                className="px-3 py-2"
                              >
                                {isRemoving ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                <span className="truncate max-w-[180px]">{classItem.name}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </>
                    )}
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      className="text-destructive px-3 py-2 focus:text-destructive"
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
            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground py-8">
              No users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};