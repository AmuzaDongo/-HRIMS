import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
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

interface MarkingCenter {
  id: string;
  name: string;
  code: string; // keep null here
  type: string;
  region: string;
  district: string;
  address: string;
  is_active: boolean;
  status: string;
}

interface ColumnActions {
  onView: (marking_center: MarkingCenter) => void;
  onEdit: (marking_center: MarkingCenter) => void;
  onDelete: (id: string) => void;
}

export const columns = (actions: ColumnActions): ColumnDef<MarkingCenter>[] => [
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

  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
  {
    id: "Type",
    header: "Type",
    cell: ({ row }) => row.original.type || "—",
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => row.original.address || "—",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={row.original.status === 'active' ? "text-green-600" : "text-red-600"}>
        {row.original.status === 'open' ? "closed" : row.original.status === 'postponed' ? "postponed" : "cancelled"}
      </span>
    ),
  },

  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const department = row.original

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
            <DropdownMenuItem onClick={() => actions.onView(department)}>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onEdit(department)}>Edit</DropdownMenuItem>
            <DropdownMenuItem  onClick={() => actions.onDelete(department.id)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]