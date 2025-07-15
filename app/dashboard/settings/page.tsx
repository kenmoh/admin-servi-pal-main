"use client";

import * as React from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChargeCommission, updateChargeCommission } from "@/actions/settings";
import { SettingsType } from "@/types/settings-types";

const payoutSchema = z.object({
  payout_charge_transaction_upto_5000_naira: z.coerce.number().min(0, "Must be 0 or positive"),
  payout_charge_transaction_from_5001_to_50_000_naira: z.coerce.number().min(0, "Must be 0 or positive"),
  payout_charge_transaction_above_50_000_naira: z.coerce.number().min(0, "Must be 0 or positive"),
  value_added_tax: z.coerce.number().min(0, "Must be 0 or positive").max(100, "Cannot exceed 100%"),
  stamp_duty: z.coerce.number().min(0, "Must be 0 or positive"),
  base_delivery_fee: z.coerce.number().min(0, "Must be 0 or positive"),
  delivery_fee_per_km: z.coerce.number().min(0, "Must be 0 or positive"),
  delivery_commission_percentage: z.coerce.number().min(0, "Must be 0 or positive").max(100, "Cannot exceed 100%"),
  food_laundry_commission_percentage: z.coerce.number().min(0, "Must be 0 or positive").max(100, "Cannot exceed 100%"),
  product_commission_percentage: z.coerce.number().min(0, "Must be 0 or positive").max(100, "Cannot exceed 100%"),
});

type PayoutFormValues = z.infer<typeof payoutSchema>;

export default function PayoutSettingsPage() {
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["settings", "charge-commission"],
    queryFn: getChargeCommission,
    refetchOnWindowFocus: false,
  });

  // Setup mutation for updating settings
  const mutation = useMutation({
    mutationFn: updateChargeCommission,
    onSuccess: (newData) => {
      toast.success("Payout settings saved successfully!");
      queryClient.setQueryData(["settings", "charge-commission"], newData);
      refetch()

    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update settings");
    },
  });

  // Prepare form with fetched data as default values
  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutSchema),
    defaultValues: data && !("error" in data)
      ? {
        payout_charge_transaction_upto_5000_naira: data.payout_charge_transaction_upto_5000_naira,
        payout_charge_transaction_from_5001_to_50_000_naira: data.payout_charge_transaction_from_5001_to_50_000_naira,
        payout_charge_transaction_above_50_000_naira: data.payout_charge_transaction_above_50_000_naira,
        value_added_tax: data.value_added_tax,
        stamp_duty: data.stamp_duty,
        base_delivery_fee: data.base_delivery_fee,
        delivery_fee_per_km: data.delivery_fee_per_km,
        delivery_commission_percentage: data.delivery_commission_percentage,
        food_laundry_commission_percentage: data.food_laundry_commission_percentage,
        product_commission_percentage: data.product_commission_percentage,
      }
      : {
        payout_charge_transaction_upto_5000_naira: 10,
        payout_charge_transaction_from_5001_to_50_000_naira: 25,
        payout_charge_transaction_above_50_000_naira: 50,
        value_added_tax: 7.5,
        stamp_duty: 50,
        base_delivery_fee: 200,
        delivery_fee_per_km: 50,
        delivery_commission_percentage: 15,
        food_laundry_commission_percentage: 20,
        product_commission_percentage: 15,
      },
  });

  // When data changes, reset the form
  React.useEffect(() => {
    if (data && !("error" in data)) {
      form.reset({
        payout_charge_transaction_upto_5000_naira: data.payout_charge_transaction_upto_5000_naira,
        payout_charge_transaction_from_5001_to_50_000_naira: data.payout_charge_transaction_from_5001_to_50_000_naira,
        payout_charge_transaction_above_50_000_naira: data.payout_charge_transaction_above_50_000_naira,
        value_added_tax: data.value_added_tax,
        stamp_duty: data.stamp_duty,
        base_delivery_fee: data.base_delivery_fee,
        delivery_fee_per_km: data.delivery_fee_per_km,
        delivery_commission_percentage: data.delivery_commission_percentage,
        food_laundry_commission_percentage: data.food_laundry_commission_percentage,
        product_commission_percentage: data.product_commission_percentage,
      });
    }
  }, [data]);

  function onSubmit(values: PayoutFormValues) {
    console.log(values)
    mutation.mutate(values as SettingsType);
  }

  // Show loading or error states
  if (isLoading) return <div className="p-8">Loading settings...</div>;
  if (isError || (data && "error" in data)) return <div className="p-8 text-red-500">Failed to load settings.</div>;

  // Use the latest data for the right card
  const current = form.getValues();

  return (
    <div className="flex flex-col gap-8 py-8 px-4 lg:px-12 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-2">Payout Settings</h1>

      <div className="flex flex-col md:flex-row w-full gap-6">
        {/* Form Card - 50% width */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Payout Charges</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="payout_charge_transaction_upto_5000_naira"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "payout_charge_transaction_upto_5000_naira"> }) => (
                      <FormItem>
                        <FormLabel>Transactions up to ₦5,000</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">₦</span>
                            <Input type="number" min={0} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payout_charge_transaction_from_5001_to_50_000_naira"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "payout_charge_transaction_from_5001_to_50_000_naira"> }) => (
                      <FormItem>
                        <FormLabel>Transactions ₦5,001 - ₦50,000</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">₦</span>
                            <Input type="number" min={0} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payout_charge_transaction_above_50_000_naira"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "payout_charge_transaction_above_50_000_naira"> }) => (
                      <FormItem>
                        <FormLabel>Transactions above ₦50,000</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">₦</span>
                            <Input type="number" min={0} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="value_added_tax"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "value_added_tax"> }) => (
                      <FormItem>
                        <FormLabel>Value Added Tax (VAT)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input type="number" step='any' min={0} max={100} {...field} />
                            <span className="text-muted-foreground">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stamp_duty"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "stamp_duty"> }) => (
                      <FormItem>
                        <FormLabel>Stamp Duty</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">₦</span>
                            <Input type="number" step='any' min={0} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="base_delivery_fee"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "base_delivery_fee"> }) => (
                      <FormItem>
                        <FormLabel>Base Delivery Fee</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">₦</span>
                            <Input type="number" step='any' min={0} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="delivery_fee_per_km"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "delivery_fee_per_km"> }) => (
                      <FormItem>
                        <FormLabel>Delivery Fee per KM</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">₦</span>
                            <Input type="number"  min={0} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="delivery_commission_percentage"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "delivery_commission_percentage"> }) => (
                      <FormItem>
                        <FormLabel>Delivery Commission</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input type="number" step='any' min={0} max={100} {...field} />
                            <span className="text-muted-foreground">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="food_laundry_commission_percentage"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "food_laundry_commission_percentage"> }) => (
                      <FormItem>
                        <FormLabel>Food/Laundry Commission</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input type="number" step='any' min={0} max={100} {...field} />
                            <span className="text-muted-foreground">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="product_commission_percentage"
                    render={({ field }: { field: ControllerRenderProps<PayoutFormValues, "product_commission_percentage"> }) => (
                      <FormItem>
                        <FormLabel>Product Commission</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input type="number" step='any' min={0} max={100} {...field} />
                            <span className="text-muted-foreground">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-4 justify-end">
                <Button className='w-full my-6' type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Display Card - 50% width */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Current Charges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Payout charge transaction upto 5000</span>
              <span className="text-lg font-semibold">₦{data?.payout_charge_transaction_upto_5000_naira}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Payout charge transaction from 5001_to_50_000</span>
              <span className="text-lg font-semibold">₦{data?.payout_charge_transaction_from_5001_to_50_000_naira}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Payout charge transaction above 50_000</span>
              <span className="text-lg font-semibold">₦{data?.payout_charge_transaction_above_50_000_naira}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Value added tax(VAT)</span>
              <span className="text-lg font-semibold">{data?.value_added_tax}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">stamp duty</span>
              <span className="text-lg font-semibold">₦{data?.stamp_duty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Base delivery fee</span>
              <span className="text-lg font-semibold">₦{data?.base_delivery_fee}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Delivery fee per km</span>
              <span className="text-lg font-semibold">₦{data?.delivery_fee_per_km}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Delivery commission percentage</span>
              <span className="text-lg font-semibold">{data?.delivery_commission_percentage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Food laundry commission percentage</span>
              <span className="text-lg font-semibold">{data?.food_laundry_commission_percentage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Product commission percentage</span>
              <span className="text-lg font-semibold">{data?.product_commission_percentage}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}