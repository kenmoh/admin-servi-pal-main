"use client";

import * as React from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/theme-toggle";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import { SectionCards } from "@/components/section-cards";

const settingsSchema = z.object({
    platformName: z.string().min(2, "Platform name is required"),
    supportEmail: z.string().email("Enter a valid email"),
    defaultLanguage: z.string().min(1, "Select a language"),
    dailyOrderLimit: z.coerce.number().min(1, "Must be at least 1"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultValues: SettingsFormValues = {
    platformName: "ServiPal",
    supportEmail: "support@servipal.com",
    defaultLanguage: "en",
    dailyOrderLimit: 100,
};

export default function SettingsPage() {
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues,
    });

    const [notifications, setNotifications] = React.useState(true);

    function onSubmit(values: SettingsFormValues) {
        toast.success("Settings saved successfully!");
        // Here you would send the settings to your backend
    }

    // Example summary cards for settings dashboard
    const cards = [
        {
            title: "Platform Name",
            value: form.watch("platformName"),
            description: "Your platform's display name",
            footer: "Shown to all users",
        },
        {
            title: "Support Email",
            value: form.watch("supportEmail"),
            description: "Contact for support",
            footer: "Displayed in help sections",
        },
        {
            title: "Default Language",
            value: form.watch("defaultLanguage") === "en" ? "English" : "French",
            description: "Language for new users",
            footer: "Users can change this",
        },
        {
            title: "Order Limit",
            value: form.watch("dailyOrderLimit"),
            description: "Max orders per day",
            footer: "Platform-wide limit",
        },
    ];

    return (
        <div className="flex flex-col gap-8 py-8 px-4 lg:px-12 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Platform Settings</h1>
            <SectionCards cards={cards} variant="settings" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Update your platform's core settings.</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="platformName"
                                    render={({ field }: { field: ControllerRenderProps<SettingsFormValues, "platformName"> }) => (
                                        <FormItem>
                                            <FormLabel>Platform Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Platform Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="supportEmail"
                                    render={({ field }: { field: ControllerRenderProps<SettingsFormValues, "supportEmail"> }) => (
                                        <FormItem>
                                            <FormLabel>Support Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="support@example.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="defaultLanguage"
                                    render={({ field }: { field: ControllerRenderProps<SettingsFormValues, "defaultLanguage"> }) => (
                                        <FormItem>
                                            <FormLabel>Default Language</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="en">English</SelectItem>
                                                        <SelectItem value="fr">French</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dailyOrderLimit"
                                    render={({ field }: { field: ControllerRenderProps<SettingsFormValues, "dailyOrderLimit"> }) => (
                                        <FormItem>
                                            <FormLabel>Daily Order Limit</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={1} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="flex gap-4 justify-end">
                                <Button type="submit">Save Settings</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
                <div className="flex flex-col gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Switch between light and dark mode.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <span>Theme</span>
                            <ModeToggle />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Enable or disable platform notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <span>Notifications</span>
                            <Toggle
                                pressed={notifications}
                                onPressedChange={setNotifications}
                                aria-label="Toggle notifications"
                                variant="outline"
                                size="sm"
                            >
                                {notifications ? "On" : "Off"}
                            </Toggle>
                            <Badge variant={notifications ? "default" : "outline"}>
                                {notifications ? "Enabled" : "Disabled"}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
