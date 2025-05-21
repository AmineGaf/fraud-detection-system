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
  onFilterChange: (filter: { 
    program?: string; 
    year?: string;
    status?: string;
  }) => void;
  currentFilters: { 
    program?: string; 
    year?: string;
    status?: string;
  };
  programs: string[]; // List of unique studying programs
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange,
  onFilterChange,
  currentFilters,
  programs 
}: SearchBarProps) => {
  const hasFilters = currentFilters.program || currentFilters.year || currentFilters.status;

  const clearFilters = () => {
    onFilterChange({ 
      program: undefined, 
      year: undefined,
      status: undefined
    });
  };

  // Generate year options (last 10 years and next 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 15 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search classes by name, program or description..."
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
          {/* Program Filter */}
          <div className="px-2 py-1 text-sm font-medium">Program</div>
          <DropdownMenuRadioGroup
            value={currentFilters.program || ''}
            onValueChange={(value) => 
              onFilterChange({ ...currentFilters, program: value || undefined })
            }
          >
            <DropdownMenuRadioItem value="">All Programs</DropdownMenuRadioItem>
            {programs.map((program) => (
              <DropdownMenuRadioItem 
                key={program} 
                value={program}
              >
                {program}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          
          {/* Year Filter */}
          <div className="px-2 py-1 text-sm font-medium mt-2">Year</div>
          <DropdownMenuRadioGroup
            value={currentFilters.year || ''}
            onValueChange={(value) => 
              onFilterChange({ ...currentFilters, year: value || undefined })
            }
          >
            <DropdownMenuRadioItem value="">All Years</DropdownMenuRadioItem>
            {yearOptions.map((year) => (
              <DropdownMenuRadioItem 
                key={year} 
                value={String(year)}
              >
                {year}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          {/* Status Filter */}
          <div className="px-2 py-1 text-sm font-medium mt-2">Status</div>
          <DropdownMenuRadioGroup
            value={currentFilters.status || ''}
            onValueChange={(value) => 
              onFilterChange({ ...currentFilters, status: value || undefined })
            }
          >
            <DropdownMenuRadioItem value="">All Statuses</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
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