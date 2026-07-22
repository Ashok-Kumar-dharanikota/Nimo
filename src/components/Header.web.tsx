import { Link } from 'expo-router';
import { Menu } from 'lucide-react-native';
import React from 'react';

export const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-black/5">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between relative">
        <Link href="/" className="flex items-center group pl-5">
          <div className="flex flex-row items-center transition-all duration-300">
            <img
              src={require('../../assets/images/nimo/brand_logo.png')}
              className="h-12 w-auto object-cover"
              alt="Nimo Logo"
            />
            {/* <img
              src={require('../../assets/images/nimo/brand_name.png')}
              className=" h-7 w-32 object-contain -ml-3"
              alt="Nimo"
            /> */}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-jakarta text-[14px] font-semibold text-[#27170c]/70 hover:text-[#27170c] transition-colors"
          >
            Features
          </button>
          <Link href="/privacy" className="font-jakarta text-[14px] font-semibold text-[#27170c]/70 hover:text-[#27170c] transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="font-jakarta text-[14px] font-semibold text-[#27170c]/70 hover:text-[#27170c] transition-colors">
            Terms
          </Link>
          <button
            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-5 py-2 ml-4 bg-[#27170c] text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-sm text-sm"
          >
            Join Waitlist
          </button>
        </nav>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 cursor-pointer transition-colors text-[#27170c]"
        >
          <Menu size={20} />
        </button>

        {/* Glassmorphic Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-14 right-6 h-fit w-48 bg-[#FAF6F0]/95 backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl py-2 flex flex-col z-50">
            <button
              onClick={() => {
                setMenuOpen(false);
                document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 text-left font-semibold text-sm hover:bg-black/5 transition-colors text-[#27170c]/85"
            >
              Features
            </button>
            <Link
              href="/privacy"
              onPress={() => setMenuOpen(false)}
              className="px-5 py-3 text-left font-semibold text-sm hover:bg-black/5 transition-colors text-[#27170c]/85"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              onPress={() => setMenuOpen(false)}
              className="px-5 py-3 text-left font-semibold text-sm hover:bg-black/5 transition-colors text-[#27170c]/85"
            >
              Terms
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 text-left font-semibold text-sm hover:bg-black/5 transition-colors text-[#27170c]/85 border-t border-black/5"
            >
              Join Waitlist
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
