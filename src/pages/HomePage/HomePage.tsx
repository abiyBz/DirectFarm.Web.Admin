import React from "react";
import ImageSlider from "../../components/ImageSlider";
import Newsletter from "../../components/Newsletter";
import SpecialOffers from "../../components/SpecialOffer";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div>
      <ImageSlider />
      <SpecialOffers />
      <Newsletter />
      
    </div>
  );
};

export default HomePage;
