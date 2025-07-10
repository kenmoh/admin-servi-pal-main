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
import { calculateOrderStats } from '@/lib/utils'
import { DeliveryDetail } from "@/types/order-types";

// Remove zod schema and related types

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

const columns: ColumnDef<DeliveryDetail>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.order.id} />,
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
    accessorKey: "order.id",
    header: "Order ID",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "delivery.delivery_type",
    header: "Delivery Type",
    cell: ({ row }) => (
      <div className="max-w-48 truncate">
        {row.original.delivery?.delivery_type || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "delivery.delivery_status",
    header: "Delivery Status",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5 capitalize">
          {row.original.delivery?.delivery_status || 'N/A'}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "delivery.duration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="max-w-48 truncate">
        {row.original.delivery?.duration || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "delivery.distance",
    header: "Distance",
    cell: ({ row }) => (
      <div className="max-w-48 truncate">
        {row.original.delivery?.distance || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "order.order_type",
    header: "Order Type",
    cell: ({ row }) => (
      <div className="max-w-32 truncate">
        {row.original.order.order_type || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "order.require_delivery",
    header: "Require Delivery",
    cell: ({ row }) => (
      <div className="max-w-48 truncate">
        {row.original.order.require_delivery || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "order.created_at",
    header: "Created At",
    cell: ({ row }) => (
      <div className="max-w-48 truncate">
        {row.original.order.created_at || "N/A"}
      </div>
    ),
  },
];

function DraggableRow({ row }: { row: Row<DeliveryDetail> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.order.id,
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

export function DeliveryDataTable({
  data: initialData,
}: {
  data: DeliveryDetail[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
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

  const [activeTab, setActiveTab] = React.useState("orders");
  const [filterText, setFilterText] = React.useState("");

  // Helper: flatten all string fields for search
  function orderMatchesFilter(order: DeliveryDetail, filter: string) {
    if (!filter) return true;
    const lower = filter.toLowerCase();
    function check(obj: any): boolean {
      if (typeof obj === 'string') return obj.toLowerCase().includes(lower);
      if (typeof obj === 'object' && obj !== null) return Object.values(obj).some(check);
      return false;
    }
    return check(order);
  }

  // Tab filtering
  function tabFilter(item: DeliveryDetail) {
    if (activeTab === "orders") return true;
    if (activeTab === "delivered") return item.delivery?.delivery_status === "delivered";
    if (activeTab === "pending") return item.delivery?.delivery_status === "pending";
    if (activeTab === "assigned") return item.delivery?.delivery_status === "accepted";
    if (activeTab === "food") return item.order?.order_type === "food";
    if (activeTab === "package") return item.order?.order_type === "package";
    if (activeTab === "laundry") return item.order?.order_type === "laundry";
    return true;
  }

  const filteredData = data.filter(tabFilter).filter(item => orderMatchesFilter(item, filterText));
  const stats = calculateOrderStats(data);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData?.map(({ order }) => order.id) || [],
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
    getRowId: (row) => row.order.id,
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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
      <div className="flex flex-col gap-2 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="view-selector" className="sr-only">View</Label>
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orders">All Orders</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="food">Food Orders</SelectItem>
              <SelectItem value="package">Package Orders</SelectItem>
              <SelectItem value="laundry">Laundry Orders</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="orders">All Order <Badge variant="secondary">{stats.totalOrders}</Badge></TabsTrigger>
            <TabsTrigger value="delivered">Delivered <Badge variant="secondary">{stats.deliveredOrders}</Badge></TabsTrigger>
            <TabsTrigger value="pending">Pending <Badge variant="secondary">{stats.pendingOrders}</Badge></TabsTrigger>
            <TabsTrigger value="assigned">Assigned <Badge variant="secondary">{stats.assignedOrders}</Badge></TabsTrigger>
            <TabsTrigger value="food">Food Orders <Badge variant="secondary">{stats.totalFoodOrders}</Badge></TabsTrigger>
            <TabsTrigger value="package">Package Orders <Badge variant="secondary">{stats.totalPackageOrders}</Badge></TabsTrigger>
            <TabsTrigger value="laundry">Laundry Orders <Badge variant="secondary">{stats.totalLaundryOrders}</Badge></TabsTrigger>
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
          </div>
        </div>
        <Input
          type="text"
          placeholder="Filter orders by any field..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="max-w-md"
        />
      </div>
      <TabsContent
        value={activeTab}
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
    </Tabs>
  )
}


function TableCellViewer({ item }: { item: DeliveryDetail }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.order.id}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Order #{item.order.id}</DrawerTitle>
          <DrawerDescription>
            {item.delivery?.delivery_type || ''} delivery details
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Order Type</Label>
              <div className="text-sm font-medium">
                <Badge variant="outline" className="capitalize">
                  {item.order.order_type}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Delivery Required</Label>
              <div className="text-sm font-medium">
                <Badge variant="outline">
                  {item.order.require_delivery}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Delivery Status</Label>
              <div className="text-sm font-medium">
                <Badge
                  variant={item.delivery?.delivery_status === "delivered" ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {item.delivery?.delivery_status === "delivered" ? (
                    <IconCircleCheckFilled className="size-3" />
                  ) : (
                    <IconLoader className="size-3 animate-spin" />
                  )}
                  {item.delivery?.delivery_status}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Delivery Type</Label>
              <div className="text-sm font-medium">
                {item.delivery?.delivery_type}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Distance</Label>
              <div className="text-sm font-medium">
                {item.delivery?.distance || "N/A"}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Duration</Label>
              <div className="text-sm font-medium">
                {item.delivery?.duration || "N/A"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Order Created At</Label>
              <div className="text-sm font-medium">
                {new Date(item.order.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <Label htmlFor="notes">Delivery Notes</Label>
            <Input
              id="notes"
              placeholder="Add delivery notes..."
              className="w-full"
            />
          </div>
        </div>
        <DrawerFooter>
          <Button>Update Delivery</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}