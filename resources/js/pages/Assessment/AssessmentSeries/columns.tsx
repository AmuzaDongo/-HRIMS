import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, MoreHorizontal, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AssessmentSeries {
  id: string;
  name: string;
  year: string;
  status: string;
}

interface ColumnActions {
  onView: (assessmentSeries: AssessmentSeries) => void;
  onEdit: (assessmentSeries: AssessmentSeries) => void;
  onDelete: (id: string) => void;
}

export const columns = (actions: ColumnActions): ColumnDef<AssessmentSeries>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  { accessorKey: "name", header: "Series" },
  { accessorKey: "year", header: "Year" },

  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original.status || "draft").toLowerCase();

      const configs: Record<
      string,
      {
        label: string;
        color: string;
        icon: React.ComponentType<{ className?: string }>;
      }
    > = {
      active: {
        label: "Active",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30",
        icon: CheckCircle2,
      },

      inactive: {
        label: "Inactive",
        color: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800",
        icon: XCircle,
      },
    };

      const config = configs[status] || configs.draft;

      return (
        <Badge 
          variant="secondary"
          className={`capitalize border-${config.color}-300 bg-${config.color}-100 text-${config.color}-700 flex items-center gap-1.5`}
        >
          <config.icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const assessmentSeries = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => actions.onView(assessmentSeries)}>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onEdit(assessmentSeries)}>Edit</DropdownMenuItem>
            <DropdownMenuItem  onClick={() => actions.onDelete(assessmentSeries.id)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]