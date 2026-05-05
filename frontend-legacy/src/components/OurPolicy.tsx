import { RefreshCw, ShieldCheck, Headphones } from "lucide-react";

const OurPolicy = () => {
  return (
    <section className="py-10 sm:py-16 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
          
          {/* Exchange Policy */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-50">
              <RefreshCw className="w-6 h-6 text-zinc-900 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-widest">
                Easy Exchange
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-[200px]">
                Hassle-free exchanges for the perfect fit, every time.
              </p>
            </div>
          </div>

          {/* Return Policy */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-50">
              <ShieldCheck className="w-6 h-6 text-zinc-900 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-widest">
                7 Days Return
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-[200px]">
                Shop with confidence with our 7-day free return window.
              </p>
            </div>
          </div>

          {/* Support Policy */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-50">
              <Headphones className="w-6 h-6 text-zinc-900 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-widest">
                Expert Support
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-[200px]">
                Dedicated concierge support available 24/7.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurPolicy;