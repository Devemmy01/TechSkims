import logo from '../assets/techskims3.png';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Large background image with overlay */}
      <div className="absolute inset-0 opacity-">
        <img 
          src={logo} 
          alt="Background" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/95 to-gray-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl font-bold text-center mb-12 text-navy-blue">About Us</h2>
        
        {/* Content container */}
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Decorative elements */}
          <div className="absolute -left-10 top-0 w-20 h-20 bg-sky-blue/10 rounded-full animate-float blur-sm"
            style={{ animationDelay: '0s' }}
          />
          <div className="absolute -right-10 bottom-0 w-16 h-16 bg-sky-blue/10 rounded-full animate-float blur-sm"
            style={{ animationDelay: '1s' }}
          />

          {/* Text content */}
          <p className="text-gray-600 mb-6 text-lg">
            At TechSkims, we're passionate about leveraging technology to solve complex business challenges. 
            With over a decade of experience, our team of experts deliver innovative solutions that drive growth and efficiency.
          </p>
          <p className="text-gray-600 text-lg">
            We pride ourselves on staying ahead of the technological curve, ensuring our clients receive cutting-edge 
            solutions that give them a competitive advantage in their respective industries.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About; 