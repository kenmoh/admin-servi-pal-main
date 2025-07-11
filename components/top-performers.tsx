"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ComprehensiveStatsResponse } from "@/types/stats-types"
import { formatCurrency, formatNumber } from "@/lib/stats-utils"

interface TopPerformersProps {
  comprehensiveStats?: ComprehensiveStatsResponse | null
}

export function TopPerformers({ comprehensiveStats }: TopPerformersProps) {
  if (!comprehensiveStats) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Best performing vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-muted-foreground">No vendor data available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest spending customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-muted-foreground">No customer data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { top_vendors, top_customers } = comprehensiveStats

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Vendors */}
      <Card>
        <CardHeader>
          <CardTitle>Top Vendors</CardTitle>
          <CardDescription>Best performing vendors by orders and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {top_vendors.slice(0, 5).map((vendor, index) => (
              <div key={vendor.vendor_id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      #{index + 1}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {vendor.vendor_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {vendor.vendor_email}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {formatCurrency(vendor.total_revenue)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(vendor.total_orders)} orders
                    </span>
                    {vendor.average_rating && (
                      <span className="text-xs text-muted-foreground">
                        ⭐ {vendor.average_rating.toFixed(1)} ({vendor.review_count} reviews)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Highest spending customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {top_customers.slice(0, 5).map((customer, index) => (
              <div key={customer.customer_id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarFallback className="bg-green-100 text-green-800">
                      #{index + 1}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {customer.customer_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {customer.customer_email}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-green-200 text-green-800">
                        {formatCurrency(customer.total_spent)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(customer.total_orders)} orders
                    </span>
                    {customer.favorite_order_type && (
                      <span className="text-xs text-muted-foreground">
                        Prefers {customer.favorite_order_type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
