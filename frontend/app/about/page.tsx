'use client';

import Title from "@/components/Title";
import { assets } from "@/assets/assets";
import NewsletterBox from "@/components/NewsletterBox";
import Image from "next/image";
import { ShieldCheck, Clock, Headset } from "lucide-react"; // Premium Icons

const About = () => {
  return (
    <div className="pt-10 transition-all duration-700">
      
      {/* --- Section 1: Hero Section --- */}
      <div className="text-2xl text-center pt-8 border-t border-zinc-100">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-16 flex flex-col md:flex-row gap-16 items-center">
        {/* Editorial Image Container */}
        <div className="w-full md:max-w-[500px] relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm border border-zinc-100">
          <Image 
            src={assets.about_img} 
            alt="About CaraStyle" 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-1000"
            priority 
          />
        </div>

        <div className="flex flex-col justify-center gap-8 md:w-1/2 text-zinc-600">
          <div className="space-y-6 text-base leading-relaxed">
            <p>
              <span className="text-black font-bold tracking-tight">CaraStyle</span> was born out of a passion for innovation and a desire to 
              revolutionize the way people shop online. Our journey started with a simple idea: 
              to provide a platform where customers can easily discover, explore, and purchase 
              a wide range of products from the comfort of their homes.
            </p>
            <p>
              Since our inception, we've worked tirelessly to curate a diverse selection of 
              high-quality products that cater to every taste and preference. From fashion 
              to home essentials, we offer an extensive collection sourced from trusted brands.
            </p>
          </div>

          <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
            <h3 className="text-black font-black text-xs tracking-[0.2em] uppercase mb-4">Our Mission</h3>
            <p className="text-sm leading-loose italic">
              "To empower customers with choice, convenience, and confidence through an 
              exceptional shopping experience that exceeds expectations at every touchpoint."
            </p>
          </div>
        </div>
      </div>

      {/* --- Section 2: Why Choose Us --- */}
      <div className="text-xl py-10">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mb-24 rounded-3xl overflow-hidden border border-zinc-100">
        
        {/* Quality Assurance */}
        <div className="bg-white p-12 lg:p-16 flex flex-col gap-6 hover:bg-zinc-50 transition-colors duration-500 group">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-black transition-colors">
            <ShieldCheck className="w-6 h-6 text-zinc-600 group-hover:text-white" />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-black text-sm tracking-widest uppercase">Quality Assurance</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We meticulously select and vet each product to ensure it meets our stringent 
              quality standards.
            </p>
          </div>
        </div>

        {/* Convenience */}
        <div className="bg-white p-12 lg:p-16 flex flex-col gap-6 border-y md:border-y-0 md:border-x border-zinc-100 hover:bg-zinc-50 transition-colors duration-500 group">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-black transition-colors">
            <Clock className="w-6 h-6 text-zinc-600 group-hover:text-white" />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-black text-sm tracking-widest uppercase">Convenience</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              With our user-friendly interface and hassle-free ordering process, shopping 
              has never been easier.
            </p>
          </div>
        </div>

        {/* Customer Service */}
        <div className="bg-white p-12 lg:p-16 flex flex-col gap-6 hover:bg-zinc-50 transition-colors duration-500 group">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-black transition-colors">
            <Headset className="w-6 h-6 text-zinc-600 group-hover:text-white" />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-black text-sm tracking-widest uppercase">Exceptional Service</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Our team of dedicated professionals is here to assist you every step of the 
              way, ensuring your satisfaction.
            </p>
          </div>
        </div>

      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;