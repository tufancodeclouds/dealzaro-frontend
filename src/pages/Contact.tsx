import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const Contact: React.FC = () => {
  return (
    <div>
      {/* Title */}
      <div className="text-center text-2xl pt-10">
        <Title text1="CONTACT" text2="US" />
      </div>

      {/* Contact Info Section */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt="Contact"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            54709 Willms Station <br /> Suite 350, Washington, USA
          </p>
          <p className="text-gray-500">
            Tel:{' '}
            <a href="tel:+919876543210" className="underline hover:text-black">
              +91-9876543210
            </a>
            <br />
            Email:{' '}
            <a
              href="mailto:contact@dealzaro.com"
              className="underline hover:text-black"
            >
              contact@dealzaro.com
            </a>
          </p>

          <p className="font-semibold text-xl text-gray-600">
            Careers at Dealzaro
          </p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Newsletter Box */}
      <NewsletterBox />
    </div>
  );
};

export default Contact;
