import React from 'react';
import { useLanguage } from '../Context/LanguageContext';

const Features: React.FC = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: '🌿',
      title: language === 'en' ? 'High Quality Products' : 'ከፍተኛ ጥራት ያላቸው ምርቶች',
      description: language === 'en' ? 'Grown with care' : 'በጥንቃቄ የተሳተፈ',
    },
    {
      icon: '🤝',
      title: language === 'en' ? 'Optional Partnership' : 'አማራጭ ስምምነት',
      description: language === 'en' ? 'Over 2 years' : 'ከ2 አመት በላይ',
    },
    {
      icon: '🚚',
      title: language === 'en' ? 'Low-Budget Shipping' : 'በቂ ቅናሽ በመላኪያ',
      description: language === 'en' ? 'Order over ETB 10,999' : 'ከ10,999 ብር በላይ ትዕዛዝ',
    },
    {
      icon: '📞',
      title: language === 'en' ? '24/7 Support' : '24/7 ድጋፍ',
      description: language === 'en' ? 'Dedicated support' : 'የተወሰነ ድጋፍ',
    },
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          {language === 'en' ? 'Why Choose Us?' : 'ለምን እኛን ይምረጡ?'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                {feature.icon} {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
