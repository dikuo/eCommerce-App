import { FormEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const NewsletterBox = () => {
  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logic for newsletter subscription goes here
  };

  return (
    <section className="py-12 sm:py-20 bg-zinc-50/50 rounded-3xl mx-4 sm:mx-8">
      <div className="max-w-2xl mx-auto text-center px-4">
        
        {/* Editorial Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 uppercase">
          Join the <span className="text-zinc-400">Cara List</span>
        </h2>
        
        <p className="mt-4 text-zinc-500 text-sm sm:text-base leading-relaxed">
          Subscribe for early access to new arrivals, exclusive private sales, 
          and a <span className="text-zinc-900 font-semibold">20% welcome gift</span> on your first order.
        </p>

        {/* Premium Form Layout */}
        <form 
          onSubmit={onSubmitHandler} 
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input 
            type="email" 
            placeholder="Email Address" 
            required 
            className="h-12 bg-white border-zinc-200 focus-visible:ring-zinc-900 rounded-full px-6"
          />
          <Button 
            type="submit" 
            className="h-12 px-8 uppercase tracking-widest text-[10px] sm:text-xs font-bold rounded-full transition-all hover:scale-[1.02] active:scale-95"
          >
            Subscribe
          </Button>
        </form>

        <p className="mt-6 text-[10px] text-zinc-400 uppercase tracking-widest">
          No spam. Just style. Unsubscribe anytime.
        </p>
        
      </div>
    </section>
  );
};

export default NewsletterBox;