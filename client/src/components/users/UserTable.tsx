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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Class, User } from "@/types/users";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "../ui/checkbox";
import { AssignClassPopover } from "./AssignClassPopover";

interface UserTableProps {
  users: User[];
  classes: Class[];
  selectedUsers: number[];
  onSelectUsers: (ids: number[]) => void;
  onAssign: (userId: number, classId: number) => void;
  onDelete: (userId: number) => void;
  isDeleting: boolean;
  isAssigning: boolean;
}

export const UserTable = ({
  users,
  classes,
  selectedUsers,
  onSelectUsers,
  onAssign,
  onDelete,
  isDeleting,
  isAssigning,
}: UserTableProps) => {
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
            <TableHead>Classes</TableHead>
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
                  <div className="flex items-center gap-2">
                    <div className="flex flex-wrap gap-1">
                      {user.classes?.map((classItem) => (
                        <Badge
                          key={classItem.id}
                          variant="outline"
                          className="bg-gray-100"
                        >
                          {classItem.name}
                        </Badge>
                      ))}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(user.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
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