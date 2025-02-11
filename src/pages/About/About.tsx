import React from 'react';
import { useLanguage } from "../../Context/LanguageContext";

const About: React.FC = () => {
  const { language } = useLanguage();
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{language === "en" ? "About Us" : "ስለ እኛ"}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{language === "en" ? "Welcome to our company!" : "ወደ ኩባንያችን እንኳን በደህና መጡ!"}</p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{language === "en" ? "We are committed to providing top-quality products and exceptional customer service." : "ከፍተኛ ጥራት ያላቸውን ምርቶች እና ልዩ የደንበኞች አገልግሎት ለማቅረብ ቁርጠኞች ነን።"} </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{language === "en" ? "Our mission is to create value for our customers through innovation, integrity, and professionalism." : "የእኛ ተልእኮ ለደንበኞቻችን በፈጠራ፣ በታማኝነት እና በሙያተኛነት እሴት መፍጠር ነው።"}</p>
      </div>
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Our Mission */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-2 text-gray-600">{language === "en" ? "Our Mission" : "ተልዕኮ"}</h2>
          <p className="text-gray-600">
          {language === "en" ? "Our mission is to deliver outstanding value to our customers by offering high-quality products and services that improve their lives." : "የእኛ ተልእኮ ህይወታቸውን የሚያሻሽሉ ምርቶችን እና አገልግሎቶችን ከፍተኛ ጥራት ያላቸውን ምርቶች በማቅረብ ለደንበኞቻችን የላቀ ዋጋ መስጠት ነው።"}
          </p>
        </div>

        {/* Our Vision */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-2 text-gray-600">{language === "en" ? "Our Vision" : "ራዕይ"}</h2>
          <p className="text-gray-600">
          {language === "en" ? "To be a globally recognized brand known for innovation, sustainability, and customer satisfaction." : "በፈጠራ፣ በዘላቂነት እና በደንበኛ እርካታ የሚታወቅ በአለም አቀፍ ደረጃ የሚታወቅ የምርት ስም ለመሆን።"}
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto mt-12 text-center">

        <h2 className="text-3xl font-bold mb-6 text-gray-600">{language === "en" ? "Meet Our Team" : "ቡድናችንን ይመልከቱ"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Team Member */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <img src="../../assets/IMG_0268.PNG" alt="Yonatan Teshome" className="rounded-full w-32 h-32 object-cover content-around" />
            <h3 className="text-xl font-semibold text-gray-600">Yonatan Teshome</h3>
            <p className="text-gray-600">Chief Executive Officer</p>
            <p className="text-gray-600">CEO</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <img src="../../assets/image.jpeg" alt="Abiy Bezuneh" className="rounded-full w-32 h-32 object-cover content-around" />
            <h3 className="text-xl font-semibold text-gray-600">Abiy Bezuneh</h3>
            <p className="text-gray-600">Chief Corporate Service Officer</p>
            <p className="text-gray-600">CCSO</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
          <img src="../../assets/image.jpeg" alt="Nebyou Yohannes" className="rounded-full w-32 h-32 object-cover content-around" />
            <h3 className="text-xl font-semibold text-gray-600">Nebyou Yohannes</h3>
            <p className="text-gray-600">Chief Technologies Officer</p>
            <p className="text-gray-600">CTO</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
          <img src="../../assets/1.jpg" alt="Soliyana Abraham" className="rounded-full w-32 h-32 object-cover content-around" />
            <h3 className="text-xl font-semibold text-gray-600">Soliyana Abraham</h3>
            <p className="text-gray-600">Head of Marketing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
