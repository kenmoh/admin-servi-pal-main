import { getLaundryItems } from "@/actions/item";
import { CustomMenuTable } from "@/components/custom-menu-table";

export default async function LaundryItemsPage() {
  const items = await getLaundryItems();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Laundry Items</h1>
      <CustomMenuTable data={items} />
    </div>
  );
}