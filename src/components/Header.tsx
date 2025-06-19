import { Search, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Info Bar */}
      <div className="hidden md:flex justify-end px-4 sm:px-6 lg:px-10 py-1 text-sm text-gray-700 space-x-6 bg-gray-50">
        <span className="cursor-pointer hover:text-black transition">Help</span>
        <span className="cursor-pointer hover:text-black transition">Orders & Returns</span>
        <span className="cursor-pointer hover:text-black transition">Hi, John</span>
      </div>

      {/* Main Header */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="text-3xl font-bold text-black">
            ECOMMERCE
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Categories", "Sale", "Clearance", "New stock", "Trending"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-black transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer transition-colors" />
            <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gray-100 text-center py-1.5 text-sm text-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2">
            <button className="text-black transition-colors">
              <ArrowLeft size={16} />
            </button>
            <span>Get 10% off on business sign up</span>
            <button className="text-black transition-colors">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
