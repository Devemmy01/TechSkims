import logo from '../assets/techskims4.png';

const Footer = () => {
  return (
    <footer className="bg-navy-blue text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={logo} alt="TechSkims" className="w-[300px] -ml-16 -mt-24" />
            <p className="text-gray-300 -mt-28">
              Transforming businesses through technology
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <p className="text-gray-300">Email: contact@techskims.tech</p>
            <p className="text-gray-300">Phone: +1 2038185237 </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-sky-blue">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-sky-blue">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-sky-blue">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} TechSkims. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 