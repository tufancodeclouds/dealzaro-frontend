import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import './HeroSlider.css';

import homeSlider1 from '../assets/homeslider01.png';
import homeSlider2 from '../assets/homeslider02.jpg';
import homeSlider3 from '../assets/homeslider03.png';

const sliderImages: string[] = [homeSlider1, homeSlider2, homeSlider3];

const HeroSlider: React.FC = () => {
  return (
    <div className="home-slider-wrapper rounded-[10px]">
      <Swiper
        spaceBetween={15}
        navigation={true}
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        className="home-slider"
      >
        {sliderImages.map((img: string, index: number) => (
          <SwiperSlide key={index}>
            <div className="item rounded-[10px] overflow-hidden">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto rounded-[10px]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
