"use client";

import * as React from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChargeCommission, updateChargeCommission, getBranding, updateBranding, getMaintenanceMode, updateMaintenanceMode } from "@/actions/settings";
import { getTeams, updatePassword } from "@/actions/user";
import { SettingsType } from "@/types/settings-types";
import { User } from "@/types/user-types";
import { Switch } from "@/components/ui/switch";

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

const passwordSchema = z.object({
  userId: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const brandingSchema = z.object({
  logo: z.string().optional(),
  primary_color: z.string().optional(),
  company_name: z.string().optional(),
});

type BrandingFormValues = z.infer<typeof brandingSchema>;

const maintenanceSchema = z.object({
  enabled: z.boolean(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

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

  const { data: teamsData, isLoading: teamsLoading, isError: teamsError } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
    refetchOnWindowFocus: false,
  });

  const passwordMutation = useMutation({
    mutationFn: (values: PasswordFormValues) => updatePassword(values.userId, values.password),
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update password");
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  function onPasswordSubmit(values: PasswordFormValues) {
    console.log(values)
    passwordMutation.mutate(values);
  }

  const { data: brandingData, isLoading: brandingLoading, isError: brandingError } = useQuery({
    queryKey: ["branding"],
    queryFn: getBranding,
    refetchOnWindowFocus: false,
  });

  const { data: maintenanceData, isLoading: maintenanceLoading, isError: maintenanceError } = useQuery({
    queryKey: ["maintenance"],
    queryFn: getMaintenanceMode,
    refetchOnWindowFocus: false,
  });

  const brandingMutation = useMutation({
    mutationFn: updateBranding,
    onSuccess: (newData) => {
      toast.success("Branding updated successfully!");
      queryClient.setQueryData(["branding"], newData);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update branding");
    },
  });

  const maintenanceMutation = useMutation({
    mutationFn: updateMaintenanceMode,
    onSuccess: (newData) => {
      toast.success("Maintenance mode updated successfully!");
      queryClient.setQueryData(["maintenance"], newData);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update maintenance mode");
    },
  });

  const brandingForm = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
  });

  const maintenanceForm = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
  });

  React.useEffect(() => {
    if (brandingData && !("error" in brandingData)) {
      brandingForm.reset(brandingData);
    }
  }, [brandingData, brandingForm]);

  React.useEffect(() => {
    if (maintenanceData && !("error" in maintenanceData)) {
      maintenanceForm.reset(maintenanceData);
    }
  }, [maintenanceData, maintenanceForm]);

  function onBrandingSubmit(values: BrandingFormValues) {
    brandingMutation.mutate(values);
  }

  function onMaintenanceSubmit(values: MaintenanceFormValues) {
    maintenanceMutation.mutate(values);
  }

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
    mutation.mutate(values as SettingsType);
  }

  // Show loading or error states
  if (isLoading || teamsLoading) return <div className="p-8">Loading settings...</div>;
  if (isError || (data && "error" in data) || teamsError) return <div className="p-8 text-red-500">Failed to load settings.</div>;

  // Use the latest data for the right card
  const current = form.getValues();

  return (
    <div className="flex flex-col gap-8 py-8 px-4 lg:px-12 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-2">Payout Settings</h1>

      <div className="flex flex-col md:flex-row w-full gap-6">
        {/* Payout Form Card */}
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
                            <Input type="number" min={0} {...field} />
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
                <Button onClick={form.handleSubmit(onSubmit)} className='w-full my-6 cursor-pointer' type="submit" disabled={mutation.isPending}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Password Change Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Change Team Member Password</CardTitle>
          </CardHeader>
          <Form {...passwordForm}>
        
              <CardContent className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Member</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a team member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamsData && !("error" in teamsData) && Array.isArray(teamsData) && teamsData.map((team: User) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.profile.full_name || team.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                   <FormField
                  control={passwordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={passwordForm.handleSubmit(onPasswordSubmit)}  className='w-full cursor-pointer my-6' type="submit" disabled={passwordMutation.isPending}>
                  {passwordMutation.isPending ? "Saving..." : "Save Password"}
                </Button>
              </CardFooter>
            
          </Form>
        </Card>

        {/* Branding Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <Form {...brandingForm}>
            <form onSubmit={brandingForm.handleSubmit(onBrandingSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={brandingForm.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandingForm.control}
                  name="primary_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandingForm.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className='my-5 w-full cursor-pointer' disabled={brandingMutation.isPending}>
                  {brandingMutation.isPending ? "Saving..." : "Save Branding"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Maintenance Mode Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Maintenance Mode</CardTitle>
          </CardHeader>
          <Form {...maintenanceForm}>
            <form onSubmit={maintenanceForm.handleSubmit(onMaintenanceSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={maintenanceForm.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Maintenance Mode</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              {/*<CardFooter>
                <Button type="submit" disabled={maintenanceMutation.isPending}>
                  {maintenanceMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>*/}
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
