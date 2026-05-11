import Link from "next/link";
import { assets } from "../assets/assets";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
          
          {/* Brand & Bio */}
          <div className="md:col-span-3 space-y-6">
            <Link href="/">
              {/* Note: Remember to update your logo image file to say 'Cara'! */}
              <img src={assets.logo} className="w-28 hover:opacity-80 transition-opacity" alt="Cara Logo" />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
              Cara brings runway-inspired aesthetics to your everyday wardrobe. 
              Positioned at the intersection of high-street trend and timeless sophistication, 
              we curate pieces for those who live for the look and lead the style.
            </p>
          </div>

          {/* Company Links */}
          <div className="md:col-span-1 space-y-6">
            <h4 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link></li>
              <li><Link href="/collection" className="hover:text-zinc-900 transition-colors">Collection</Link></li>
              <li><Link href="/about" className="hover:text-zinc-900 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-900 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="md:col-span-1 space-y-6">
            <h4 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider">Get In Touch</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li>+1-626-456-7890</li>
              <li>
                <a href="mailto:hello@carastyle.com" className="hover:text-zinc-900 transition-colors">
                  hello@cara.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col items-center">
          <p className="text-sm text-zinc-400 text-center">
            Copyright {currentYear}@cara.com All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;