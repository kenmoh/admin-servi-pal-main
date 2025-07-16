"use client"

import * as React from "react";
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
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { WalletSchema } from "@/types/user-types";
import { UserProfileModal } from '@/components/user-profile'

function DragHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({ id });
    return (
        <Button {...attributes} {...listeners} variant="ghost" size="icon" className="text-muted-foreground size-7 hover:bg-transparent">
            <span className="sr-only">Drag to reorder</span>
            <span>::</span>
        </Button>
    );
}

const columns: ColumnDef<WalletSchema>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        accessorKey: "id",
        header: "Wallet ID",
        cell: ({ row }) => <WalletDrawer wallet={row.original} />,
        enableHiding: false,
    },


    {
        accessorKey: "profile.full_name",
        header: "Name",
        cell: ({ row }) => <span>{row.original?.profile?.business_name || row.original?.profile?.full_name || "N/A"}</span>,
        enableHiding: false,
    },
    {
        accessorKey: "profile.phone_number",
        header: "Phone Number",
        cell: ({ row }) => <span>{row.original?.profile?.phone_number || "N/A"}</span>,
        enableHiding: false,
    },

    {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => <span>{row.original.balance}</span>,
    },
    {
        accessorKey: "escrow_balance",
        header: "Escrow Balance",
        cell: ({ row }) => <span>{row.original.escrow_balance}</span>,
    },
];

function DraggableRow({ row }: { row: Row<WalletSchema> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });
    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{ transform: CSS.Transform.toString(transform), transition }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
        </TableRow>
    );
}

function WalletDrawer({ wallet }: { wallet: WalletSchema }) {
    const [open, setOpen] = React.useState(false);
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="link" className="p-0 h-auto min-h-0 text-blue-600 cursor-pointer underline">
                    {wallet.id}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle><UserProfileModal userId={wallet.id} /></DrawerTitle>
                    <DrawerTitle>Transactions for Wallet:   {wallet.id}</DrawerTitle>
                    <DrawerTitle>Total Transactions:   {wallet?.transactions.length}</DrawerTitle>
                </DrawerHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Payment By</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {wallet.transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>{tx.id}</TableCell>
                                <TableCell>{tx.amount}</TableCell>
                                <TableCell>
                                    {/* Payment Status Pill */}
                                    {['successful', 'completed', 'paid'].includes(tx.payment_status) ? (
                                        <span className="rounded-full px-3 py-1 text-sm font-medium bg-green-500/5 text-green-700">
                                            {tx.payment_status}
                                        </span>
                                    ) : ['failed', 'cancelled'].includes(tx.payment_status) ? (
                                        <span className="rounded-full px-3 py-1 text-sm font-medium bg-red-500/5 text-red-700">
                                            {tx.payment_status}
                                        </span>
                                    ) : (
                                        <span className="rounded-full px-3 py-1 text-sm font-medium bg-yellow-500/5 text-yellow-700">
                                            {tx.payment_status}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {/* Transaction Type Pill */}
                                    {tx.transaction_type === 'credit' ? (
                                        <span className="rounded-full px-3 py-1 text-sm font-medium bg-green-500/5 text-green-700">
                                            {tx.transaction_type}
                                        </span>
                                    ) : tx.transaction_type === 'debit' ? (
                                        <span className="rounded-full px-3 py-1 text-sm font-medium bg-red-500/5 text-red-700">
                                            {tx.transaction_type}
                                        </span>
                                    ) : (
                                        <span className="rounded-full px-3 py-1 text-sm font-medium bg-gray-500/5  text-gray-700">
                                            {tx.transaction_type}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>{tx.payment_by}</TableCell>
                                <TableCell>{tx.payment_method || 'N/A'}</TableCell>
                                <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DrawerContent>
        </Drawer>
    );
}
// }

export function WalletDataTable({ data: initialData }: { data: WalletSchema[] }) {
    const [data, setData] = React.useState(() => initialData);

    // Type guard: if data is not an array, show error
    if (!Array.isArray(data)) {
        return <div className="p-4 text-red-500">Failed to load wallets.</div>;
    }
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
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
    const [filterText, setFilterText] = React.useState("");

    // Helper: flatten all string fields for search
    function walletMatchesFilter(wallet: WalletSchema, filter: string) {
        if (!filter) return true;
        const lower = filter.toLowerCase();
        function check(obj: any): boolean {
            if (typeof obj === 'string') return obj.toLowerCase().includes(lower);
            if (typeof obj === 'object' && obj !== null) return Object.values(obj).some(check);
            if (typeof obj === 'number') return obj.toString().includes(lower);
            return false;
        }
        return check(wallet);
    }

    const filteredData = data.filter(item => walletMatchesFilter(item, filterText));

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => filteredData?.map(({ id }) => id) || [],
        [filteredData]
    )

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
        getRowId: (row) => row.id,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((prev) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(prev, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="flex flex-col gap-2 px-4 lg:px-6">
            <Input
                type="text"
                placeholder="Filter wallets by any field..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="max-w-md mb-4"
            />
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
        </div>
    );
} 