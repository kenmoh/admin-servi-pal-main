"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useAppContext } from "@/lib/context";
import { X, User, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BeneficiaryData } from "@/types/beneficiary-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function DetailRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-sm" : "font-medium"}>{value}</span>
    </div>
  );
}

export function BeneficiaryDetailDrawer() {
  const { selectedBeneficiary, setSelectedBeneficiary } = useAppContext();
  const queryClient = useQueryClient();

  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery<BeneficiaryData>({
    queryKey: ["beneficiary-detail", selectedBeneficiary?.id],
    queryFn: async () => {
      const response = await fetch(`/api/beneficiaries/${selectedBeneficiary!.id}`);
      if (!response.ok) throw new Error("Failed to fetch beneficiary details");
      const json = await response.json();
      return json.data;
    },
    enabled: !!selectedBeneficiary,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/beneficiaries/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete beneficiary");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Beneficiary deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      setSelectedBeneficiary(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!selectedBeneficiary) return null;

  const displayData = detail || selectedBeneficiary;

  return (
    <Drawer
      open={!!selectedBeneficiary}
      onOpenChange={(open) => !open && setSelectedBeneficiary(null)}
      direction="right"
    >
      <DrawerContent className="max-w-md h-full right-0 left-auto top-0 bottom-0 rounded-none border-none">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Beneficiary Details</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">{displayData.full_name || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <DetailRow label="Beneficiary ID" value={displayData.id} mono />
              <DetailRow label="Account Number" value={displayData.account_number} mono />
              <DetailRow label="Bank Name" value={displayData.bank_name} />
              <DetailRow label="Bank Code" value={displayData.bank_code} mono />
              <DetailRow
                label="Created"
                value={new Date(displayData.created_at).toLocaleDateString()}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-4 border-t">
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="p-4 border-t mt-auto bg-muted/30">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => deleteMutation.mutate(displayData.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete Beneficiary
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
