"use client"

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconLoader,
  IconPlus,
  IconLayoutColumns,
} from "@tabler/icons-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeliveryDetail, PaginatedDeliveryDetailResponse } from "@/types/order-types";
import { RiderProfileModal } from "./rider-profile";
import { useIsMobile } from "@/hooks/use-mobile";

const columns: ColumnDef<DeliveryDetail>[] = [
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
      return <TableCellViewer item={row.original} />;
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
          <DrawerTitle>Order ID: {item.order.id}</DrawerTitle>
          <DrawerTitle>Order #{item.order.order_number}</DrawerTitle>
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
        </div>
        <DrawerFooter>
          <Button>Update Delivery</Button>
          {item?.delivery?.rider_id && <RiderProfileModal userId={item?.delivery.rider_id} />}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function PickupOrderDataTable({
  data,
  loading,
  error,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  data: PaginatedDeliveryDetailResponse["data"];
  loading: boolean;
  error?: string;
  total: PaginatedDeliveryDetailResponse["total"];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      rowSelection,
    },
    getRowId: (row) => row.order.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const pageCount = Math.ceil(total / pageSize);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-4  lg:px-6">
        <h1 className="text-2xl font-medium">Pickup Orders</h1>
        <div className="flex items-center gap-2">
          {/* Optionally add a filter input here if you want client-side filtering */}
        </div>
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
                      {column.id.replace(/\./g, ' ')}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table className='w-full'>
          <TableHeader className="bg-muted">
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {page + 1} of {pageCount}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
              onClick={() => onPageChange(0)}
              disabled={page === 0}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8 cursor-pointer"
              size="icon"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8 cursor-pointer"
              size="icon"
              onClick={() => onPageChange(page + 1)}
              disabled={page + 1 >= pageCount}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex cursor-pointer"
              size="icon"
              onClick={() => onPageChange(pageCount - 1)}
              disabled={page + 1 >= pageCount}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}



// "use client"

// import * as React from "react"
// import {
//   IconChevronDown,
//   IconChevronLeft,
//   IconChevronRight,
//   IconChevronsLeft,
//   IconChevronsRight,
//   IconCircleCheckFilled,
//   IconDotsVertical,
//   IconLayoutColumns,
//   IconLoader,
//   IconPlus,
//   IconEye,
// } from "@tabler/icons-react"
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
//   VisibilityState,
// } from "@tanstack/react-table"
// import { toast } from "sonner"

// import { useIsMobile } from "@/hooks/use-mobile"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// import { DeliveryDetail } from "@/types/order-types";
// import { RiderProfileModal } from "./rider-profile"

// const columns: ColumnDef<DeliveryDetail>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       </div>
//     ),
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       </div>
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "order.id",
//     header: "Order ID",
//     cell: ({ row }) => {
//       return <TableCellViewer item={row.original} />
//     },
//     enableHiding: false,
//   },
//   {
//     accessorKey: "delivery.delivery_type",
//     header: "Delivery Type",
//     cell: ({ row }) => (
//       <div className="max-w-48 truncate">
//         {row.original.delivery?.delivery_type || "N/A"}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "delivery.delivery_status",
//     header: "Delivery Status",
//     cell: ({ row }) => (
//       <div className="w-32">
//         <Badge variant="outline" className="text-muted-foreground px-1.5 capitalize">
//           {row.original.delivery?.delivery_status || 'N/A'}
//         </Badge>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "delivery.duration",
//     header: "Duration",
//     cell: ({ row }) => (
//       <div className="max-w-48 truncate">
//         {row.original.delivery?.duration || "N/A"}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "delivery.distance",
//     header: "Distance",
//     cell: ({ row }) => (
//       <div className="max-w-48 truncate">
//         {row.original.delivery?.distance || "N/A"}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "order.order_type",
//     header: "Order Type",
//     cell: ({ row }) => (
//       <div className="max-w-32 truncate">
//         {row.original.order.order_type || "N/A"}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "order.require_delivery",
//     header: "Require Delivery",
//     cell: ({ row }) => (
//       <div className="max-w-48 truncate">
//         {row.original.order.require_delivery || "N/A"}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "order.created_at",
//     header: "Created At",
//     cell: ({ row }) => (
//       <div className="max-w-48 truncate">
//         {row.original.order.created_at || "N/A"}
//       </div>
//     ),
//   },
// ];


// function TableCellViewer({ item }: { item: DeliveryDetail }) {
//   const isMobile = useIsMobile();

//   return (
//     <Drawer direction={isMobile ? "bottom" : "right"}>
//       <DrawerTrigger asChild>
//         <Button variant="link" className="text-foreground w-fit px-0 text-left">
//           {item.order.id}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className="gap-1">
//           <DrawerTitle>Order #{item.order.id}</DrawerTitle>
//           <DrawerDescription>
//             {item.delivery?.delivery_type || ''} delivery details
//           </DrawerDescription>
//         </DrawerHeader>
//         <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex flex-col gap-1">
//               <Label>Order Type</Label>
//               <div className="text-sm font-medium">
//                 <Badge variant="outline" className="capitalize">
//                   {item.order.order_type}
//                 </Badge>
//               </div>
//             </div>
//             <div className="flex flex-col gap-1">
//               <Label>Delivery Required</Label>
//               <div className="text-sm font-medium">
//                 <Badge variant="outline">
//                   {item.order.require_delivery}
//                 </Badge>
//               </div>
//             </div>
//           </div>

//           <Separator />

//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex flex-col gap-1">
//               <Label>Delivery Status</Label>
//               <div className="text-sm font-medium">
//                 <Badge
//                   variant={item.delivery?.delivery_status === "delivered" ? "default" : "secondary"}
//                   className="flex items-center gap-1"
//                 >
//                   {item.delivery?.delivery_status === "delivered" ? (
//                     <IconCircleCheckFilled className="size-3" />
//                   ) : (
//                     <IconLoader className="size-3 animate-spin" />
//                   )}
//                   {item.delivery?.delivery_status}
//                 </Badge>
//               </div>
//             </div>
//             <div className="flex flex-col gap-1">
//               <Label>Delivery Type</Label>
//               <div className="text-sm font-medium">
//                 {item.delivery?.delivery_type}
//               </div>
//             </div>
//           </div>

//           <Separator />

//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex flex-col gap-1">
//               <Label>Distance</Label>
//               <div className="text-sm font-medium">
//                 {item.delivery?.distance || "N/A"}
//               </div>
//             </div>
//             <div className="flex flex-col gap-1">
//               <Label>Duration</Label>
//               <div className="text-sm font-medium">
//                 {item.delivery?.duration || "N/A"}
//               </div>
//             </div>
//           </div>

//           <Separator />

//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex flex-col gap-1">
//               <Label>Order Created At</Label>
//               <div className="text-sm font-medium">
//                 {new Date(item.order.created_at).toLocaleString()}
//               </div>
//             </div>
//           </div>
//           <Separator />
//         </div>
//         <DrawerFooter>
//           <Button>Update Delivery</Button>
//           {item?.delivery?.rider_id && <RiderProfileModal userId={item?.delivery.rider_id} />}
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export function DeliveryDataTable({
//   data: initialData,
// }: {
//   data: DeliveryDetail[];
// }) {
//   const [rowSelection, setRowSelection] = React.useState({})
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({})
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize: 10,
//   })

//   const [filterText, setFilterText] = React.useState("");

//   // Helper: flatten all string fields for search
//   function orderMatchesFilter(order: DeliveryDetail, filter: string) {
//     if (!filter) return true;
//     const lower = filter.toLowerCase();
//     function check(obj: any): boolean {
//       if (typeof obj === 'string') return obj.toLowerCase().includes(lower);
//       if (typeof obj === 'object' && obj !== null) return Object.values(obj).some(check);
//       return false;
//     }
//     return check(order);
//   }

//   let filteredData: DeliveryDetail[] = [];
//   try {
//     filteredData = Array.isArray(initialData)
//       ? initialData.filter(item => orderMatchesFilter(item, filterText))
//       : [];
//   } catch (e) {
//     console.error('Error filtering delivery data:', e);
//     filteredData = [];
//   }

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       pagination,
//     },
//     getRowId: (row) => row.order.id,
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   })

//   return (
//     <div className="w-full space-y-4">
//       <div className="flex items-center justify-between px-4 lg:px-6">
//         <h1 className="text-xl font-medium">Order Management</h1>
//         <div className="flex items-center gap-2">
//           <Input
//             placeholder="Filter deliveries..."
//             value={filterText}
//             onChange={(event) => setFilterText(event.target.value)}
//             className="max-w-sm"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <IconLayoutColumns />
//                 <span className="hidden lg:inline">Customize Columns</span>
//                 <span className="lg:hidden">Columns</span>
//                 <IconChevronDown />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               {table
//                 .getAllColumns()
//                 .filter(
//                   (column) =>
//                     typeof column.accessorFn !== "undefined" &&
//                     column.getCanHide()
//                 )
//                 .map((column) => {
//                   return (
//                     <DropdownMenuCheckboxItem
//                       key={column.id}
//                       className="capitalize"
//                       checked={column.getIsVisible()}
//                       onCheckedChange={(value) =>
//                         column.toggleVisibility(!!value)
//                       }
//                     >
//                       {column.id.replace(/\./g, ' ')}
//                     </DropdownMenuCheckboxItem>
//                   )
//                 })}
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <Button variant="outline" size="sm">
//             <IconPlus />
//             <span className="hidden lg:inline">Add Delivery</span>
//           </Button>
//         </div>
//       </div>

//       <div className="overflow-hidden rounded-lg border px-4 lg:px-6">
//         <Table>
//           <TableHeader className="bg-muted">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id} colSpan={header.colSpan}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                     </TableHead>
//                   )
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex items-center justify-between px-4">
//         <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//         <div className="flex w-full items-center gap-8 lg:w-fit">
//           <div className="hidden items-center gap-2 lg:flex">
//             <Label htmlFor="rows-per-page" className="text-sm font-medium">
//               Rows per page
//             </Label>
//             <Select
//               value={`${table.getState().pagination.pageSize}`}
//               onValueChange={(value) => {
//                 table.setPageSize(Number(value))
//               }}
//             >
//               <SelectTrigger size="sm" className="w-20" id="rows-per-page">
//                 <SelectValue
//                   placeholder={table.getState().pagination.pageSize}
//                 />
//               </SelectTrigger>
//               <SelectContent side="top">
//                 {[10, 20, 30, 40, 50].map((pageSize) => (
//                   <SelectItem key={pageSize} value={`${pageSize}`}>
//                     {pageSize}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="flex w-fit items-center justify-center text-sm font-medium">
//             Page {table.getState().pagination.pageIndex + 1} of{" "}
//             {table.getPageCount()}
//           </div>
//           <div className="ml-auto flex items-center gap-2 lg:ml-0">
//             <Button
//               variant="outline"
//               className="hidden h-8 w-8 p-0 lg:flex"
//               onClick={() => table.setPageIndex(0)}
//               disabled={!table.getCanPreviousPage()}
//             >
//               <span className="sr-only">Go to first page</span>
//               <IconChevronsLeft />
//             </Button>
//             <Button
//               variant="outline"
//               className="size-8"
//               size="icon"
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//             >
//               <span className="sr-only">Go to previous page</span>
//               <IconChevronLeft />
//             </Button>
//             <Button
//               variant="outline"
//               className="size-8"
//               size="icon"
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//             >
//               <span className="sr-only">Go to next page</span>
//               <IconChevronRight />
//             </Button>
//             <Button
//               variant="outline"
//               className="hidden size-8 lg:flex"
//               size="icon"
//               onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//               disabled={!table.getCanNextPage()}
//             >
//               <span className="sr-only">Go to last page</span>
//               <IconChevronsRight />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }