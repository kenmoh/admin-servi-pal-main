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
import { IconPlus } from "@tabler/icons-react"
import { useState } from "react"


const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phone_number: z.string().min(1, { message: "Invalid Phone Number" }),
  password: z.string().min(1, { message: "Password is required" }),
  confirm_password: z.string().min(1, { message: "Confirm Password is required" }),

});

type RegisterValues = z.infer<typeof registerSchema>;

export function AddUserDialog() {
  const [open, setOpen] = useState(false)

   const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      phone_number: "",
      password: "",
      confirm_password:""
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
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: ControllerRenderProps<RegisterValue, "email"> }) => (
                <FormItem className='my-10'>
                  <FormLabel className='my-3'>Email</FormLabel>
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
              name="phone_number"
              render={({ field }: { field: ControllerRenderProps<RegisterValue, "phone_number"> }) => (
                <FormItem className='my-10'>
                  <FormLabel className='my-3'>Phone Number</FormLabel>
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
              render={({ field }: { field: ControllerRenderProps<RegisterValue, "password"> }) => (
                <FormItem className='my-10'>
                  <FormLabel className='my-3'>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="**********"
                      type="password"
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
              render={({ field }: { field: ControllerRenderProps<RegisterValue, "password"> }) => (
                <FormItem className='my-10'>
                  <FormLabel className='my-3'>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}