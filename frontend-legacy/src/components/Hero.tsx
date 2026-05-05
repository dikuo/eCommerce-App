import { Button } from "./ui/button";
import { assets } from "../assets/assets";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-zinc-50 overflow-hidden min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Content (Typography & Call to Action) */}
        <div className="flex-1 space-y-8 z-10 text-center lg:text-left mt-8 lg:mt-0">
          
          {/* Subtle Pulse Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-sm font-medium text-zinc-800 shadow-sm mx-auto lg:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
            New Fall Collection Live
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.1]">
            Elevate your <br className="hidden lg:block" /> everyday style.
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-zinc-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Discover our latest arrivals featuring premium materials, minimalist aesthetics, and unparalleled comfort designed for the modern individual.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link to="/collection" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                Shop Collection <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-transparent border-zinc-300 hover:bg-zinc-100 transition-all">
                Our Story
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Content (Image Presentation) */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto">
          
          {/* Main Image Container - 🟢 Removed 'cursor-pointer' */}
          <div className="group aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl z-10">
            <img
              src={assets.hero_img} 
              alt="Latest Collection"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Subtle inner shadow gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
          </div>
          
          {/* Decorative background shapes */}
          <div className="absolute -inset-4 bg-zinc-200/60 rounded-[2rem] -z-10 rotate-3 scale-105 transition-transform duration-1000 hidden lg:block"></div>
          <div className="absolute -inset-4 bg-zinc-100 rounded-[2rem] -z-20 -rotate-2 scale-105 hidden lg:block"></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;