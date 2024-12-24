import { useEffect } from "react";
import bg from "../assets/bg.png";
import Section from "../components/Section";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <h2 className="text-3xl font-bold text-center mb-8 pt-16 text-white">
          About Us
        </h2>
      </section>

      <div className="max-w-3xl mx-auto text-center pt-20 pb-20">
        {/* Text content */}
        <p className="text-gray-600 mb-6 text-lg">
          At TechSkims, we're passionate about leveraging technology to solve
          complex business challenges. With over a decade of experience, our
          team of experts deliver innovative solutions that drive growth and
          efficiency.
        </p>
        <p className="text-gray-600 text-lg">
          We pride ourselves on staying ahead of the technological curve,
          ensuring our clients receive cutting-edge solutions that give them a
          competitive advantage in their respective industries.
        </p>
      </div>

      <div className="mb-16">
        <Section />
      </div>
    </>
  );
};

export default About;
