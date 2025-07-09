import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DeliveryDetail } from "@/types/order-types";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function calculateOrderStats(orders: DeliveryDetail[]) {
  const stats = {
    totalOrders: orders.length,
    assignedOrders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    totalFoodOrders: 0,
    totalLaundryOrders: 0,
    totalPackageOrders: 0,
  };

  orders.forEach((order) => {
    // Count by delivery status
    switch (order.delivery?.delivery_status) {
      case 'pending':
        stats.pendingOrders++;
        break;
      case 'delivered':
        stats.deliveredOrders++;
        break;
      case 'accept':
        stats.assignedOrders++;
        break;
    }

    // Count by order type
    switch (order.order?.order_type) {
      case 'food':
        stats.totalFoodOrders++;
        break;
      case 'package':
        stats.totalPackageOrders++;
        break;
      case 'laundry':
        stats.totalLaundryOrders++;
        break;
    }
  });

  return stats;
}