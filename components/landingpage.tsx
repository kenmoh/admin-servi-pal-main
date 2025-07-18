import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Target, Zap, Globe } from 'lucide-react';

const ServiPal = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const profileData = [
    { number: 1, label: 'Designers' },
    { number: 2, label: 'Developers' },
    { number: 3, label: 'Marketers' },
    { number: 4, label: 'Writers' },
    { number: 5, label: 'Analysts' },
    { number: 6, label: 'Strategists' },
    { number: 7, label: 'Managers' },
    { number: 8, label: 'Consultants' }
  ];

  const ProfileCircle = ({ number, label, delay, radius, angle, size = 'w-12 h-12' }) => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setRotation(prev => prev + 0.5);
      }, 100);
      return () => clearInterval(interval);
    }, []);

    const x = Math.cos((rotation + angle) * Math.PI / 180) * radius;
    const y = Math.sin((rotation + angle) * Math.PI / 180) * radius;

    return (
      <div
        className={`absolute transition-all duration-300 hover:scale-110 flex flex-col items-center`}
        style={{
          transform: `translate(${x}px, ${y}px)`,
          animationDelay: `${delay}s`
        }}
      >
        <div className={`${size} rounded-full border-2 border-white/20 backdrop-blur-sm hover:border-white/40 bg-white/10 flex items-center justify-center mb-2`}>
          <span className="text-white font-bold text-lg">
            {number}
          </span>
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
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-between px-6 py-12 max-w-7xl mx-auto">
        {/* Left Side - Text Content */}
        <div className="flex-1 max-w-xl mt-28">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
               “Your Neighborhood in Your Pocket — Order, Deliver, Wash”
           <h1 className="text-4xl italic text-gray-300">Transforming Errands into Ease</h1>
        
          </h1>

          <p className='text-xl mb-8 text-white'>
            From doorstep deliveries to sparkling laundry, satisfying meals to seamless peer-to-peer shopping — we’re your all-in-one app for modern living.

          </p>



            <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://play.google.com/store"
                  className="rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-12" />
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  className="rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-12" />
                </a>
              </div>
          
        </div>

        {/* Right Side - Animated Circles */}
        <div className="flex-1 relative flex items-center justify-center mt-20">
          <div className="relative w-98 h-98">
            {/* Center Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-2 border-white/20 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-white mb-2">20k+</div>
                <div className="text-white/80 text-sm">Specialists</div>
              </div>
            </div>

            {/* Outer Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full border border-white/10" />
            </div>

            {/* Animated Profile Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              {profileData.map((profile, index) => (
                <ProfileCircle
                  key={index}
                  number={profile.number}
                  label={profile.label}
                  delay={index * 0.5}
                  radius={160}
                  angle={index * 45}
                  size={index % 3 === 0 ? 'w-16 h-16' : 'w-12 h-12'}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiPal;