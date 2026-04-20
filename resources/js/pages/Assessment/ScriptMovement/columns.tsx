import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Inbox,
  MoreHorizontal,
  Repeat,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ScriptMovement } from "@/types/script-movement";


interface ColumnActions {
  onView: (script: ScriptMovement) => void;
  onEdit: (script: ScriptMovement) => void;
  onDelete: (id: string) => void;
}

/* ================= STATUS CONFIG ================= */

const movementConfig = {
  dispatch: {
    label: "Dispatched",
    className: "bg-amber-100 text-amber-700",
    icon: Truck,
  },
  receive: {
    label: "Received",
    className: "bg-blue-100 text-blue-700",
    icon: Inbox,
  },
  internal_transfer: {
    label: "Transfer",
    className: "bg-purple-100 text-purple-700",
    icon: Repeat,
  },
  return: {
    label: "Returned",
    className: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
};

/* ================= COLUMNS ================= */

export const columns = (actions: ColumnActions): ColumnDef<ScriptMovement>[] => [
  /* Select */
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
    enableSorting: false,
  },


  /* Batch */
  {
    accessorFn: (row) => row.script_batch?.batch_code,
    header: "Batch Code",
  },

  /* Centers */
  {
    accessorFn: (row) => row.from_center?.name || "-",
    header: "From",
  },
  {
    accessorFn: (row) => row.to_center?.name || "-",
    header: "To",
  },

  /* Destination */
  {
    accessorKey: "to_location",
    header: "Destination",
  },

  /* Movement Type */
  {
    id: "movement_type",
    header: "Movement",
    cell: ({ row }) => {
      const type = row.original.movement_type;
      const config = movementConfig[type];

      const Icon = config.icon;

      return (
        <Badge className={`flex items-center gap-1 ${config.className}`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },

  /* Date */
  {
    accessorKey: "moved_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.moved_at);
      return date.toLocaleString();
    },
  },

  /* Actions */
  {
    id: "actions",
    cell: ({ row }) => {
      const script = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => actions.onView(script)}>
              View
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => actions.onEdit(script)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => actions.onDelete(script.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];