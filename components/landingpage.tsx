import React, { useState, useEffect } from "react";
import { ChevronRight, Users, Target, Zap, Globe } from "lucide-react";
import Link from "next/link";

interface MousePosition {
  x: number;
  y: number;
}

interface Radius {
  number: number;
  label: string;
  delay: number;
  radius: number;
  angle: number;
  size: string;
}

const ServiPal = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const profileData = [
    { number: 1, label: "Delivery Orders" },
    { number: 2, label: "Food Orders" },
    { number: 3, label: "Laundry Orders" },
    { number: 4, label: "Total User" },
    { number: 5, label: "Analysts" },
    { number: 6, label: "Strategists" },
    { number: 7, label: "Managers" },
    { number: 8, label: "Consultants" },
  ];

  const ProfileCircle = ({
    number,
    label,
    delay,
    radius,
    angle,
    size = "w-12 h-12",
  }: Radius) => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setRotation((prev) => prev + 0.5);
      }, 100);
      return () => clearInterval(interval);
    }, []);

    const x = Math.cos(((rotation + angle) * Math.PI) / 180) * radius;
    const y = Math.sin(((rotation + angle) * Math.PI) / 180) * radius;

    return (
      <div
        className={`absolute transition-all duration-300 hover:scale-110 flex flex-col items-center`}
        style={{
          transform: `translate(${x}px, ${y}px)`,
          animationDelay: `${delay}s`,
        }}
      >
        <div
          className={`${size} rounded-full border-2 border-white/20 backdrop-blur-sm hover:border-white/40 bg-white/10 flex items-center justify-center mb-2`}
        >
          <span className="text-white font-bold text-lg">{number}</span>
        </div>
        <span className="text-white/80 text-xs font-medium whitespace-nowrap bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-black to-orange-300 overflow-hidden">
      {/* Background Animation */}
      <div
        className="fixed inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-between px-6 py-12 max-w-7xl mx-auto">
        {/* Left Side - Text Content */}
        <div className="flex-1 w-full mt-[50%] md:mt-[12.5%]">
          <h1 className="text-3xl text-center md:text-6xl font-bold text-white leading-tight mb-8">
            From doorstep deliveries to sparkling laundry, satisfying meals to
            seamless peer-to-peer shopping — we’re your all-in-one app for
            modern living.
          </h1>

          {/*  <p className="text-3xl text-center mb-8 text-white">
            “Your Neighbourhood in Your Pocket — Order, Deliver, Wash”
          </p>*/}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://play.google.com/store"
              className="rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-12"
              />
            </Link>
            <a
              href="https://www.apple.com/app-store/"
              className="rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                className="h-12"
              />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiPal;
