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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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

// Create a separate component for the drag handle
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


  {
    id: "actions",
    cell: () => (
      <div>

        <IconEye />

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
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  const [filterText, setFilterText] = React.useState("");

  // Helper: flatten all string fields for search
  function userMatchesFilter(user: any, filter: string) {
    if (!filter) return true;
    const lower = filter.toLowerCase();
    // Recursively check all string fields
    function check(obj: any): boolean {
      if (typeof obj === 'string') return obj.toLowerCase().includes(lower);
      if (typeof obj === 'object' && obj !== null) return Object.values(obj).some(check);
      return false;
    }
    return check(user);
  }

  const filteredData = data.filter(item => userMatchesFilter(item, filterText));

  const [open, setOpen] = React.useState(false);

  return (
    <Tabs
      defaultValue="users"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex flex-col gap-2 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="users">
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">All Users</SelectItem>
              <SelectItem value="restaurant">Restaurant Vendors</SelectItem>
              <SelectItem value="laundry">Laundry Vendor</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="riders">Riders</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="restaurant">
              Restaurant Vendors
            </TabsTrigger>
            <TabsTrigger value="laundry">
              Laundry Vendor
            </TabsTrigger>
            <TabsTrigger value="customers">
              Customers <Badge variant="secondary">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="riders">
              Riders
            </TabsTrigger>
          </TabsList>
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
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id.replace(/profile\./, '').replace(/_/g, ' ')}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                  <IconPlus />
                  <span className="hidden lg:inline">Add User</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add User</DialogTitle>
                  <DialogDescription>Fill in the details to add a new user.</DialogDescription>
                </DialogHeader>
                <Form>
                  <FormField name="email">
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField name="phone_number">
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Phone Number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField name="password">
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField name="confirm_password">
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm Password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </Form>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Input
          type="text"
          placeholder="Filter users by any field..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="max-w-md"
        />
      </div>
      <TabsContent
        value="users"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
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
      </TabsContent>
      <TabsContent
        value="restaurant"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {/* Restaurant Vendors Table */}
        <UserDataTable data={filteredData.filter(item => item.user_type === 'restaurant_vendor')} />
      </TabsContent>
      <TabsContent
        value="laundry"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {/* Laundry Vendors Table */}
        <UserDataTable data={filteredData.filter(item => item.user_type === 'laundry_vendor')} />
      </TabsContent>
      <TabsContent
        value="customers"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {/* Customers Table */}
        <UserDataTable data={filteredData.filter(item => item.user_type === 'customer')} />
      </TabsContent>
      <TabsContent
        value="riders"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {/* Riders Table */}
        <UserDataTable data={filteredData.filter(item => item.user_type === 'rider')} />
      </TabsContent>
    </Tabs>
  )
}


function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();
  const [isBlocked, setIsBlocked] = React.useState(item.is_blocked);

  // Helper for account status pill
  function AccountStatusPill({ status }: { status: boolean }) {
    return status ? (
      <Badge variant="default" className="bg-green-500 text-white">Confirmed</Badge>
    ) : (
      <Badge variant="default" className="text-gray-500 border">Pending</Badge>
    );
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

          {/* New fields: is_blocked, order_cancel_count, account_status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Blocked Status</Label>
              <div className="text-sm font-medium">
                {isBlocked ? (
                  <Badge variant="destructive">Blocked</Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
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

          <div className="flex flex-col gap-1 mt-4">
            <Button
              variant={isBlocked ? "default" : "destructive"}
              onClick={() => setIsBlocked(b => !b)}
            >
              {isBlocked ? "Unblock User" : "Block User"}
            </Button>
          </div>

        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

