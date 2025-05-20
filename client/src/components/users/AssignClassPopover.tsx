import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import type { Class } from "@/types/users";

interface AssignClassPopoverProps {
  userId: number;
  currentClassId?: number;
  allClasses: Class[];
  onAssign: (userId: number, classId: number) => void;
  disabled?: boolean;
}

export function AssignClassPopover({
  userId,
  currentClassId,
  allClasses,
  onAssign,
  disabled = false,
}: AssignClassPopoverProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = allClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.studying_program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentClass = allClasses.find(cls => cls.id === currentClassId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="justify-start gap-2"
          disabled={disabled}
        >
          {currentClass ? (
            <>
              <PlusCircle className="h-4 w-4" />
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Assign class</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command>
          <CommandInput 
            placeholder="Search classes..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {filteredClasses.length === 0 ? (
              <div className="py-6 text-center text-sm">
                No classes found
              </div>
            ) : (
              filteredClasses.map((classItem) => (
                <CommandItem
                  key={classItem.id}
                  value={`${classItem.name} ${classItem.studying_program}`}
                  onSelect={() => {
                    onAssign(userId, classItem.id);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span>{classItem.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {classItem.studying_program} • {classItem.year}
                    </span>
                  </div>
                  {currentClassId === classItem.id && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}