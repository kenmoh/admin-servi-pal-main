import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Smartphone, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to ServiPal",
  description:
    "Your email has been confirmed. Welcome to the ServiPal community!",
};

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-accent/5 flex flex-col">
      {/* Navigation */}
      <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                src="/mainicon.png"
                alt="ServiPal Logo"
                width={32}
                height={32}
              />
            </div>
            <span className="font-bold text-lg">ServiPal</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-accent" />
                </div>
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-accent/20 animate-ping" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="bg-linear-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                ServiPal!
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your email has been confirmed successfully. You&apos;re all set to
              start using ServiPal!
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border/50" />
            <Smartphone className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Open App Section */}
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Tap the button below to open the ServiPal app and sign in.
            </p>

            {/* Deep Link Button */}
            <a
              href="servipal://sign-in"
              className="group inline-flex items-center justify-center gap-3 w-full px-8 py-4 rounded-xl bg-accent text-accent-foreground font-semibold text-lg hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
            >
              <Image
                src="/mainicon.png"
                alt="ServiPal"
                width={24}
                height={24}
                className="brightness-0 invert"
              />
              Open ServiPal App
              <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Fallback Info */}
            <div className="p-4 rounded-xl bg-card border border-border/50 space-y-2">
              <p className="text-sm text-muted-foreground">
                Button not working? Open the{" "}
                <span className="font-semibold text-foreground">
                  ServiPal
                </span>{" "}
                app manually on your device and sign in with your email.
              </p>
            </div>
          </div>

          {/* Download Section */}
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have the app yet? Download it now:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="https://play.google.com/store"
                className="rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-11"
                />
              </Link>
              <a
                href="https://www.apple.com/app-store/"
                className="rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-11"
                />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ServiPal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/support"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Support
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
