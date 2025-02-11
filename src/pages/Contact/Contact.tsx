import React from 'react';
import { useLanguage } from "../../Context/LanguageContext";


const Contact: React.FC = () => {
  const { language } = useLanguage();
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto text-center py-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{language === 'en'? 'Contact Us' : 'ያነጋግሩን'}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === 'en'? 'Have questions or need help? Feel free to reach out to us anytime. We\'re here to assist you!' : 'ጥያቄዎች አሉዎት ወይም እርዳታ ይፈልጋሉ? በማንኛውም ጊዜ እኛን ለማግኘት ነፃነት ይሰማዎ። እኛ እርስዎን ለመርዳት ዝግጁ ነን!'}
        </p>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto mt-8 max-w-lg bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">{language === 'en'? 'Send us a Message' : 'መልእክት ላኩልን'}</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">{language === 'en'? 'Name' : 'ስም'}</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">{language === 'en'? 'Email' : 'ኢሜል አድራሻ'}</label>
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea 
              placeholder="Your Message" 
              rows={5}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="container mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Our Contact Details</h2>
        <p className="text-gray-600">📧 Email: support@example.com</p>
        <p className="text-gray-600">📞 Phone: +251 94 259 8619</p>
        <p className="text-gray-600">📍 Address: 123 Debrezeyit Street, Addis Ababa, Ethiopia</p>
      </div>
    </div>
  );
};

export default Contact;
