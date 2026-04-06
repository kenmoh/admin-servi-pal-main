import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="min-h-svh w-full grid md:grid-cols-2">
      {/* Left branding panel */}
      <div className="hidden md:flex flex-col justify-between bg-orange-500 p-10 text-white">
        <div className="flex items-center gap-3 font-bold text-xl">
          <Image
            src="/mainicon.png"
            alt="ServiPal Logo"
            width={36}
            height={36}
            className="rounded-lg brightness-0 invert"
          />
          ServiPal
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-bold leading-snug">
            Platform
            <br />
            Control Center
          </p>
          <p className="text-white/70 text-sm">
            Exclusive management dashboard for the platform.
          </p>
        </div>
        <p className="text-white/50 text-xs">
          &copy; {new Date().getFullYear()} ServiPal. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to your account
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
