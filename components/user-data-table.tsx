"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMutation } from "@tanstack/react-query"
import {
  IconEye,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { Loader } from "lucide-react";
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AddUserDialog } from "@/components/add-user"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toggleBlockUser } from "@/actions/user";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export const schema = z.object({
  id: z.string(),
  email: z.string(),
  user_type: z.string(),
  order_cancel_count: z.string().optional(),
  is_blocked: z.boolean(),
  account_status: z.boolean(),
  created_at: z.string().optional(),
  profile: z.object({
    phone_number: z.string().optional(),
    business_name: z.string().optional(),
    business_address: z.string().optional(),
    business_registration_number: z.string().optional(),
    full_name: z.string().optional(),
    account_holder_name: z.string().optional(),
    bank_name: z.string().optional(),
    store_name: z.string().optional(),
    bank_account_number: z.string().optional(),
    bike_number: z.string().optional(),
  })
})

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "User ID",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="max-w-48 truncate">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "user_type",
    header: "User Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5 capitalize">
          {row.original.user_type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "profile.full_name",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="max-w-48 truncate">
        {row.original.profile.full_name || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "profile.phone_number",
    header: "Phone",
    cell: ({ row }) => (
      <div className="max-w-32 truncate">
        {row.original.profile.phone_number || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "profile.business_name",
    header: "Business Name",
    cell: ({ row }) => (
      <div className="max-w-48 truncate">
        {row.original.profile.business_name || "N/A"}
      </div>
    ),
  },

]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function UserDataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filterText, setFilterText] = React.useState("");
  const [debouncedFilterText, setDebouncedFilterText] = React.useState("");
  const [isMounted, setIsMounted] = React.useState(false);


  // Fix hydration error by waiting for component to mount
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debounce the filter text to avoid excessive re-renders
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(filterText);
    }, 300);

    return () => clearTimeout(timer);
  }, [filterText]);

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  // Memoized filtered data with phone_number added to search
  const filteredData = React.useMemo(() => {
    if (!debouncedFilterText) return data;

    const searchTerm = debouncedFilterText.toLowerCase();

    return data.filter(user => {
      const fieldsToSearch = [
        user.id,
        user.email,
        user.user_type,
        user.profile.full_name || "",
        user.profile.business_name || "",
        user.profile.phone_number || ""
      ];

      return fieldsToSearch.some(field =>
        field.toLowerCase().includes(searchTerm)
      );
    });
  }, [data, debouncedFilterText]);

  const dataIds = React.useMemo(() =>
    filteredData.map(({ id }) => id),
    [filteredData]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })



  const [open, setOpen] = React.useState(false);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">User Management</h2>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()).map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id.replace(/profile\./, '').replace(/_/g, ' ')}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <AddUserDialog />
          </div>
        </div>
        <Input
          type="text"
          placeholder="Search by ID, email, phone, user type, full name, or business name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-md mb-8"
        />
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">

          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/*</DndContext>*/}
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();
  const [isBlocked, setIsBlocked] = React.useState(item.is_blocked);
  const [isMounted, setIsMounted] = React.useState(false);

  const { mutate: toggleBlock, isPending } = useMutation({
    mutationFn: toggleBlockUser,
    onSuccess: (data) => {
      if ("is_blocked" in data) {
        setIsBlocked(data.is_blocked);
      }
      // Optionally handle error case here
    },
    onError: () => {
      // toast.error("Failed to update user status");
    }
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  function AccountStatusPill({ status }: { status: boolean }) {
    return status ? (
      <Badge variant="default" className="bg-green-500 text-white">Confirmed</Badge>
    ) : (
      <Badge variant="default" className="text-white border rounded-full">Pending</Badge>
    );
  }

  if (!isMounted) {
    return <span>{item.id}</span>; // Simple fallback during SSR
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.id}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>User Details</DrawerTitle>
          <DrawerDescription>
            {item.profile.full_name || item.email}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>User Type</Label>
              <div className="text-sm font-medium">
                <Badge variant="outline" className="capitalize">
                  {item.user_type}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>User ID</Label>
              <div className="text-sm font-medium font-mono">
                {item.id}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <div className="text-sm font-medium">{item.email}</div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Phone</Label>
              <div className="text-sm font-medium">
                {item.profile.phone_number || "N/A"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Full Name</Label>
              <div className="text-sm font-medium">
                {item.profile.full_name || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Account Holder</Label>
              <div className="text-sm font-medium">
                {item.profile.account_holder_name || "N/A"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Business Name</Label>
              <div className="text-sm font-medium">
                {item.profile.business_name || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Store Name</Label>
              <div className="text-sm font-medium">
                {item.profile.store_name || "N/A"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Business Address</Label>
              <div className="text-sm font-medium">
                {item.profile.business_address || "N/A"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Bank Name</Label>
              <div className="text-sm font-medium">
                {item.profile.bank_name || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Account Number</Label>
              <div className="text-sm font-medium font-mono">
                {item.profile.bank_account_number || "N/A"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Business Registration</Label>
              <div className="text-sm font-medium">
                {item.profile.business_registration_number || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Bike Number</Label>
              <div className="text-sm font-medium">
                {item.profile.bike_number || "N/A"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Blocked Status</Label>
              <div className="text-sm font-medium">
                {isBlocked ? (
                  <Badge variant="destructive">Blocked</Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-600 rounded-full">Active</Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Order Cancel Count</Label>
              <div className="text-sm font-medium">
                {item.order_cancel_count || 0}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <Label>Account Status</Label>
            <div className="text-sm font-medium">
              <AccountStatusPill status={item.account_status} />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button
            className='cursor-pointer'
            variant={isBlocked ? "default" : "destructive"}
            onClick={() => toggleBlock(item.id)}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {isBlocked ? "Unblocking..." : "Blocking..."}
              </>
            ) : isBlocked ? (
              "Unblock"
            ) : (
              "Block"
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}