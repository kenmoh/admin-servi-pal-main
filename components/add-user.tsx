"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { z } from "zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { IconPlus, IconLoader, IconEye, IconEyeOff } from "@tabler/icons-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createStaff } from "@/actions/user"
import { toast } from "sonner"


const registerSchema = z.object({

  email: z.string().email({ message: "Invalid email address" }),
  phone_number: z.string().min(1, { message: "Phone number is required" }),
  full_name: z.string().min(1, { message: "Full name is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirm_password: z.string().min(1, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function AddUserDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      phone_number: "",
      full_name: "",
      password: "",
      confirm_password: ""
    },
  });

  const { mutate: createStaffMutation, isPending } = useMutation({
    mutationFn: createStaff,
    onSuccess: (data) => {
      if ("success" in data) {
        toast.success("Staff created successfully!");
        setOpen(false);
        form.reset();
        // Invalidate and refetch teams data
        queryClient.invalidateQueries({ queryKey: ['teams'] });
      } else {
        toast.error(data.error || "Failed to create staff");
      }
    },
    onError: (error) => {
      toast.error("An error occurred while creating staff");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <IconPlus />
        <span className="hidden lg:inline">Add User</span>
      </Button>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Fill in the details to add a new user.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((data) => {
          const { confirm_password, ...staffData } = data;
          createStaffMutation(staffData);
        })}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: ControllerRenderProps<RegisterValues, "email"> }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }: { field: ControllerRenderProps<RegisterValues, "full_name"> }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }: { field: ControllerRenderProps<RegisterValues, "phone_number"> }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="23490989877"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }: { field: ControllerRenderProps<RegisterValues, "password"> }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="**********"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }: { field: ControllerRenderProps<RegisterValues, "confirm_password"> }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Staff"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}