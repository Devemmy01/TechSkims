import React from "react";
import bg from "../assets/bg.png";
import Section from "../components/Section";
const Gallery = () => {
  return (
    <>
      <section
        id="home"
        className="bg-navy-blue text-white py-20 relative overflow-hidden"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 pt-20 text-white">
          Gallery
        </h2>
      </section>

      <div className="mt-14">
      <Section />
      </div>
    </>
  );
};

export default Gallery;
