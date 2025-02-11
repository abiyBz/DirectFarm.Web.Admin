import React from 'react';
import { useLanguage } from "../Context/LanguageContext";

const Newsletter: React.FC = () => {
  const { language } = useLanguage();

  return (
    <section className="bg-gray-100 py-5 px-5 md:px-20 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
        {language === "en"
          ? "Subscribe to receive Latest Offers & Updates"
          : "አዳዲስ ቅናሾች እና ማሻሻያዎችን ለማግኘት ለደንበኝነት ይመዝገቡ"}
      </h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        {language === "en"
          ? "Join our newsletter for exclusive deals and updates straight to your inbox!"
          : "ለልዩ ልዩ ቅናሾች እና ዝመናዎች በቀጥታ ወደ መልእክት ሳጥንዎ የእኛን መረጃ መረብመረብ ይቀላቀሉ"}
      </p>
      <form className="flex flex-col md:flex-row justify-center items-center gap-4">
        <input
          type="email"
          placeholder={
            language === "en"
              ? "Enter your e-mail address"
              : "የኢሜል አድራሻዎን ያስገቡ"
          }
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
        >
          {language === "en" ? "Subscribe" : "መዝግብ"}
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
