'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/actions/user";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader } from "lucide-react";
import { toast } from "sonner"; // Optional: for better error handling

const LoginSchema = z.object({
  username: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function Login() {
  const router = useRouter();

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isPending, mutate, error, data } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data?.success) {
        // Optional: Show success toast
        // toast.success("Login successful!");
        router.push('/dashboard');
      } else {
        // Handle server-side validation errors
        if (data?.errors) {
          // Set form errors for specific fields
          Object.entries(data.errors).forEach(([field, message]) => {
            form.setError(field as keyof LoginValues, {
              type: 'server',
              message: Array.isArray(message) ? message.join(", ") : message
            });
          });
        }
      }
    },
    onError: (error) => {
      console.error('Login error:', error);

      // toast.error("Something went wrong. Please try again.");
    }
  });

  const onSubmit = async (data: LoginValues) => {
    // Clear any previous errors
    form.clearErrors();
    console.log(data, 'Data')

    // Convert object to FormData to match backend expectation
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    mutate(formData);
  };

  // Handle general server errors
  const serverError = data?.message && !data?.success ? data.message : null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-1/4 max-w-md rounded-sm shadow-none p-6 glass-card animate-fade-in">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tighter">Welcome back</h1>
            <p className="text-muted-foreground text-[12px]">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Display server errors */}
          {serverError && (
            <div className="text-red-300 text-sm text-center bg-red-400/10 p-3 rounded-md border border-red-400/10">
              {serverError}
            </div>
          )}



          <Form {...form}>

            <FormField
              control={form.control}
              name="username"
              render={({ field }: { field: ControllerRenderProps<LoginValues, "username"> }) => (
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
              name="password"
              render={({ field }: { field: ControllerRenderProps<LoginValues, "password"> }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full my-10"
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}