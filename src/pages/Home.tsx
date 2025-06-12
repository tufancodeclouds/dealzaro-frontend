import React from 'react';
import HeroSlider from '../components/HeroSlider';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';

const Home: React.FC = () => {
  return (
    <>
      <HeroSlider />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </>
  );
};

export default Home;
