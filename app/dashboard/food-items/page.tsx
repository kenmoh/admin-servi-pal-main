import { getFoodMenus } from "@/actions/item";
import { CustomMenuTable } from "@/components/custom-menu-table";

export default async function FoodItemsPage() {
  const menus = await getFoodMenus();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Food Items</h1>
      <CustomMenuTable data={menus} />
    </div>
  );
}
