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
import { TransactionSchema } from "@/types/transaction-types"

export const schema = z.object({
    id: z.string(),
    wallet_id: z.string(),
    amount: z.number(),
    payment_by: z.string().optional(),
    transaction_type: z.enum(["credit", "debit", "fund wallet", "paid with wallet"]),
    payment_status: z.enum(["failed", "paid", "cancelled", "pending", "completed", "successful"]),
    payment_method: z.enum(["card", "bank_transfer", "wallet"]).optional(),
    payment_link: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
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
        header: "Transaction ID",
        cell: ({ row }) => (
            <div className="max-w-32 truncate font-mono text-sm">
                {row.original.id}
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "wallet_id",
        header: "Wallet ID",
        cell: ({ row }) => (
            <div className="max-w-32 truncate font-mono text-sm">
                {row.original.wallet_id}
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <div className="font-medium">
                ₦{row.original.amount.toLocaleString()}
            </div>
        ),
    },
    {
        accessorKey: "transaction_type",
        header: "Type",
        cell: ({ row }) => (
            <Badge
                variant={row.original.transaction_type === "credit" || row.original.transaction_type === "fund wallet" ? "default" : "secondary"}
                className="capitalize"
            >
                {row.original.transaction_type}
            </Badge>
        ),
    },
    {
        accessorKey: "payment_status",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.payment_status === "completed" || row.original.payment_status === "successful" || row.original.payment_status === "paid"
                        ? "default"
                        : row.original.payment_status === "pending"
                            ? "secondary"
                            : "destructive"
                }
                className="capitalize"
            >
                {row.original.payment_status}
            </Badge>
        ),
    },
    {
        accessorKey: "payment_method",
        header: "Payment Method",
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.payment_method || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "payment_by",
        header: "Payment By",
        cell: ({ row }) => (
            <div className="max-w-32 truncate">
                {row.original.payment_by || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {new Date(row.original.created_at).toLocaleDateString()}
            </div>
        ),
    },
    {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {new Date(row.original.updated_at).toLocaleDateString()}
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
            style={{ transform: CSS.Transform.toString(transform), transition }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function TransactionDataTable({
    data: initialData,
}: {
    data: z.infer<typeof schema>[]
}) {
    const [data, setData] = React.useState(() => initialData)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
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
    const isMobile = useIsMobile()

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

        if (active.id !== over?.id) {
            setData((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over?.id)

                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Filter transactions..."
                        value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("id")?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto h-8">
                                <IconLayoutColumns className="mr-2 h-4 w-4" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
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
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
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
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                modifiers={[restrictToVerticalAxis]}
                            >
                                <SortableContext
                                    items={dataIds}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {table
                                        .getRowModel()
                                        .rows.slice(0, 20)
                                        .map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                </SortableContext>
                            </DndContext>
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
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <IconChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <IconChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
} 