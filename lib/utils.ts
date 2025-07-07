import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function calculateOrderStats(orders: OrderWithDelivery[]) {
  const stats = {
    totalPending: 0,
    pendingFood: 0,
    pendingPackage: 0,
    pendingLaundry: 0,
  };

  orders.forEach((order) => {
    if (order.delivery?.delivery_status === "pending") {
      stats.totalPending++;
      
      switch (order.delivery.delivery_type) {
        case "food":
          stats.pendingFood++;
          break;
        case "package":
          stats.pendingPackage++;
          break;
        case "laundry":
          stats.pendingLaundry++;
          break;
      }
    }
  });

  return stats;
}