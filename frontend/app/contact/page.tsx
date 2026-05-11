'use client';

import Title from "@/components/Title";
import { assets } from "@/assets/assets";
import NewsletterBox from "@/components/NewsletterBox";
import Image from "next/image";
import { MapPin, Phone, Mail, Briefcase, ChevronRight } from "lucide-react";

const Contact = () => {
  return (
    <div className="pt-10">
      {/* --- Page Title --- */}
      <div className="text-center text-2xl pt-8 border-t border-zinc-100">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      {/* --- Main Content Section --- */}
      <div className="my-16 flex flex-col justify-center md:flex-row gap-16 mb-28 items-start">
        
        {/* Editorial Image Container */}
        <div className="w-full md:max-w-[480px] relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl shadow-sm border border-zinc-100">
          <Image 
            src={assets.contact_img} 
            alt="Contact CaraStyle" 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-1000"
            priority
          />
        </div>

        {/* Contact Details Container */}
        <div className="flex flex-col justify-center items-start gap-10 md:w-1/2">
          
          {/* Store Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-[0.2em] text-zinc-400 uppercase">Our Flagship Store</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0 border border-zinc-100">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <p className="text-zinc-600 leading-relaxed pt-1">
                  5401 Stevens Rd <br />
                  <span className="text-black font-semibold">Santa Cruz, CA, USA</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0 border border-zinc-100">
                  <Phone className="w-4 h-4 text-black" />
                </div>
                <p className="text-zinc-600">(510) 332-0312</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0 border border-zinc-100">
                  <Mail className="w-4 h-4 text-black" />
                </div>
                <p className="text-zinc-600">admin@cara.com</p>
              </div>
            </div>
          </div>

          {/* Careers Section */}
          <div className="w-full p-8 bg-zinc-50/50 rounded-3xl border border-zinc-100 space-y-6">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-black" />
              <h3 className="text-xs font-black tracking-[0.2em] text-black uppercase">Careers at Cara</h3>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We are always looking for innovative minds to join our team. Explore our current 
              job openings and find your place in the future of fashion.
            </p>
            <button className="group flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-[10px] font-black tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all active:scale-95">
              Explore Openings
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;