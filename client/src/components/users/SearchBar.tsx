import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: { role?: string; class?: string }) => void;
  currentFilters: { role?: string; class?: string };
  classes: { id: number; name: string }[];
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange,
  onFilterChange,
  currentFilters,
  classes 
}: SearchBarProps) => {
  const hasFilters = currentFilters.role || currentFilters.class;

  const clearFilters = () => {
    onFilterChange({ role: undefined, class: undefined });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {hasFilters && (
              <span className="ml-1 text-primary">•</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <div className="px-2 py-1 text-sm font-medium">Role</div>
          <DropdownMenuRadioGroup
            value={currentFilters.role || ''}
            onValueChange={(value) => 
              onFilterChange({ ...currentFilters, role: value || undefined })
            }
          >
            <DropdownMenuRadioItem value="">All Roles</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="admin">admin</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="supervisor">Supervisor</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="student">Student</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          
          <div className="px-2 py-1 text-sm font-medium mt-2">Class</div>
          <DropdownMenuRadioGroup
            value={currentFilters.class || ''}
            onValueChange={(value) => 
              onFilterChange({ ...currentFilters, class: value || undefined })
            }
          >
            <DropdownMenuRadioItem value="">All Classes</DropdownMenuRadioItem>
            {classes.map((classItem) => (
              <DropdownMenuRadioItem 
                key={classItem.id} 
                value={String(classItem.id)}
              >
                {classItem.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          {hasFilters && (
            <div className="mt-2 border-t pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear filters
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};