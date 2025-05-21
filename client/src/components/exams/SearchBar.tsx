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
import { useState, useEffect } from "react";

interface ExamsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: { 
    class_id?: string; 
    status?: string;
  }) => void;
  currentFilters: { 
    class_id?: string; 
    status?: string;
  };
  classOptions: { id: number; name: string }[];
  statusOptions: { id: string; name: string }[];
}

export const ExamsSearchBar = ({ 
  searchTerm, 
  onSearchChange,
  onFilterChange,
  currentFilters,
  classOptions,
  statusOptions 
}: ExamsSearchBarProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const hasFilters = currentFilters.class_id || currentFilters.status;

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearchChange(value);
  };

  const clearFilters = () => {
    onFilterChange({ 
      class_id: undefined, 
      status: undefined
    });
    onSearchChange("");
    setLocalSearchTerm("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exams by name..."
          className="pl-10"
          value={localSearchTerm}
          onChange={handleSearchChange}
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
          {/* Class Filter */}
          <div className="px-2 py-1 text-sm font-medium">Class</div>
          <DropdownMenuRadioGroup
            value={currentFilters.class_id || ''}
            onValueChange={(value) => 
              onFilterChange({ ...currentFilters, class_id: value || undefined })
            }
          >
            <DropdownMenuRadioItem value="">All Classes</DropdownMenuRadioItem>
            {classOptions.map((option) => (
              <DropdownMenuRadioItem 
                key={option.id} 
                value={option.id.toString()}
              >
                {option.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          
          <div className="px-2 py-1 text-sm font-medium mt-2">Status</div>
          <DropdownMenuRadioGroup
            value={currentFilters.status || ''}
            onValueChange={(value) => 
              onFilterChange({ ...currentFilters, status: value || undefined })
            }
          >
            <DropdownMenuRadioItem value="">All Statuses</DropdownMenuRadioItem>
            {statusOptions.map((option) => (
              <DropdownMenuRadioItem 
                key={option.id} 
                value={option.id}
              >
                {option.name}
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