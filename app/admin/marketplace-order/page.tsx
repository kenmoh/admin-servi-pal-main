"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Filter, Search } from "lucide-react";
import React, { useState } from "react";
import { useAppContext } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/data-table";
import { useQuery } from "@tanstack/react-query";
import { ProductOrderListResponse, ProductOrderSummary } from "@/types/product-types";
import { productColumns } from "@/components/tables/product-columns";
import { ProductDetailDrawer } from "@/components/drawers/product-detail-drawer";

const MarketplaceOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { setSelectedProductOrder } = useAppContext();

  const { data, isLoading } = useQuery<ProductOrderListResponse>({
    queryKey: ["product-orders", page],
    queryFn: async () => {
      const response = await fetch(`/api/products?page=${page}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch product orders");
      return response.json();
    },
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const handleRowClick = (product: ProductOrderSummary) => {
    setSelectedProductOrder(product);
  };

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Marketplace Order Management" />
        <div className="space-y-6 px-6 py-4">
          <div>
            <p className="text-muted-foreground">
              Track active and pending marketplace orders in real-time.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search marketplace orders..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading marketplace orders...
            </div>
          ) : (
            <>
              <DataTable columns={productColumns} data={orders} onRowClick={handleRowClick} />

              {meta && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.total_pages} &mdash; {meta.total} total
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === meta.total_pages}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              <ProductDetailDrawer />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MarketplaceOrder;
