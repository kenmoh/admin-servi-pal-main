'use client'
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/actions/user";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader } from "lucide-react";


export const LoginSchema = z.object({
  username: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});



type LoginValues = z.infer<typeof LoginSchema>;

export default function Login() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(loginUser, undefined)

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",

    },
  });


  const onSubmit = async (data: LoginValues) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    action(formData);
  };

  // Handle successful login
  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard');
    }
  }, [state?.success, router]);


  return (
    <div className="max-h-screen w-full flex items-center my-[200] justify-center bg-background p-4">
      <Card className="w-1/4 max-w-md rounded-sm shadow-none p-6 glass-card animate-fade-in">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tighter">Welcome back</h1>
            <p className="text-muted-foreground text-[12px]">
              Enter your credentials to access your account
            </p>
          </div>
          {<p className="text-red-300 text-sm text-center">{state?.message}</p>}
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>

                    {state?.errors?.username && <p className="text-red-300 text-sm text-center">{state?.errors?.username.join(',')}</p>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>

                    {state?.errors?.password && <p className="text-red-300 text-sm text-center">{state?.errors?.password.join(',')}</p>}
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full my-10 text-white ">
                {isPending ? <Loader /> : ' Login'}

              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}