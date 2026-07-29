import { Link } from 'expo-router';

export const Footer = () => {
  return (
    <footer className="border-t border-surfaceContainer/30 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1.25 rounded-full">
            {/* <img
              src={require('../../assets/images/nimo/nimo_logo.png')}
              className="w-10 h-10 object-contain"
              alt="Nimo Logo"
            /> */}
            <img
              src={require('../../assets/images/nimo/brand_name.png')}
              className="h-10 object-contain"
              alt="Nimo"
            />
          </div>
          <p className="font-jakarta text-[13px] text-onSurfaceVariant/60 text-center md:text-left">
            Your mindful space. Built for your daily flow.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link href="/" className="font-jakarta text-[13px] text-onSurfaceVariant/70 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/privacy" className="font-jakarta text-[13px] text-onSurfaceVariant/70 hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="font-jakarta text-[13px] text-onSurfaceVariant/70 hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>

        <p className="font-jakarta text-[12px] text-onSurfaceVariant/50">
          &copy; {new Date().getFullYear()} Nimo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
