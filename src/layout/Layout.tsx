import React from "react";
import Footer from "../components/Footer";
import Routers from "../routes/Routers";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Layout: React.FC = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Header />
      <main>
        <SearchBar />
        <Routers />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
