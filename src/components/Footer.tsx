import React from 'react';
import { useLanguage } from "../Context/LanguageContext";

// Define the translation strings for both English and Amharic
const translations = {
  en: {
    aboutUs: "About Us",
    aboutText: "We are dedicated to providing the best quality products to our customers, ensuring satisfaction and reliability.",
    quickLinks: "Quick Links",
    home: "Home",
    products: "Products",
    about: "About",
    contact: "Contact",
    contactUs: "Contact Us",
    email: "Email: support@example.com",
    phone: "Phone: +123 456 7890",
    address: "Address: 123 Main St, Cityville",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    rightsReserved: "Your Company. All rights reserved.",
  },
  am: {
    aboutUs: "ስለ እኛ",
    aboutText: "እኛ ለደንበኞቻችን ምርጥ ጥራት ምርቶችን ማቅረብ ላይ ተደርጎ እንሰራለን፣ ማንበብን እና ታመን እንዲሆን።",
    quickLinks: "ፈጣን እትም",
    home: "መነሻ",
    products: "ምርቶች",
    about: "ስለ እኛ",
    contact: "እኛን ያግኙን",
    contactUs: "እኛን ያግኙን",
    email: "ኢሜል፡ support@example.com",
    phone: "ስልክ፡ +123 456 7890",
    address: "አድራሻ፡ 123 Main St, Cityville",
    privacyPolicy: "የመለኪያ ፖሊሲ",
    termsOfService: "የአጠቃቀም ስምምነት",
    rightsReserved: "እንዲሁም ኩባንያዎች፡ ሁሉም መብቶች ተሸፈነ።",
  }
};

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-green-950 text-white py-8 static bottom-0 w-full">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-2">{t.aboutUs}</h3>
            <p className="text-sm">{t.aboutText}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-2">{t.quickLinks}</h3>
            <ul className="text-sm space-y-2">
              <li><a href="/" className="hover:text-gray-400">{t.home}</a></li>
              <li><a href="/all-products" className="hover:text-gray-400">{t.products}</a></li>
              <li><a href="/about" className="hover:text-gray-400">{t.about}</a></li>
              <li><a href="/contact" className="hover:text-gray-400">{t.contact}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-2">{t.contactUs}</h3>
            <ul className="text-sm space-y-2">
              <li>{t.email}</li>
              <li>{t.phone}</li>
              <li>{t.address}</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>{t.rightsReserved}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-400">&copy;{t.privacyPolicy}</a>
            <a href="#" className="hover:text-gray-400">{t.termsOfService}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
