import { Link } from "react-router-dom";
import logo from "../assets/techskims2.png";

const Footer = () => {
  return (
    <footer className="text-white py-8 mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between w-full gap-8 pb-24">
          <div className="w-full">
            <img
              src={logo}
              alt="TechSkims"
              className="w-[220px] -ml-1 -mt-24"
            />
            <p className="text-black mt-1">
              Empowering Your Business with Innovative Solutions.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-5 md:gap-20 lg:gap-44 mt-5 md:mt-0 w-full">
            <div className="text-black whitespace-nowrap">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="grid gap-2">
                <Link to="/about" className="text-black">About Us</Link>
                <Link to="/contact" className="text-black">Contact Us</Link>
                <Link to="/services" className="text-black">Services</Link>
              </div>
            </div>
            {/* <div className="text-black mt-5 md:mt-0">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex flex-col gap-4">
                <a href="#" className="flex gap-3">
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 13.1924C22 7.63586 17.5229 3.13135 12 3.13135C6.47715 3.13135 2 7.63586 2 13.1924C2 18.2141 5.65684 22.3765 10.4375 23.1313V16.1007H7.89844V13.1924H10.4375V10.9759C10.4375 8.45431 11.9305 7.06147 14.2146 7.06147C15.3088 7.06147 16.4531 7.25798 16.4531 7.25798V9.73396H15.1922C13.95 9.73396 13.5625 10.5096 13.5625 11.3052V13.1924H16.3359L15.8926 16.1007H13.5625V23.1313C18.3432 22.3765 22 18.2143 22 13.1924Z"
                      fill="black"
                    />
                  </svg>
                  Facebook
                </a>
                <a href="#" className="flex gap-3">
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16 4.13135H8C5.23858 4.13135 3 6.36993 3 9.13135V17.1313C3 19.8927 5.23858 22.1313 8 22.1313H16C18.7614 22.1313 21 19.8927 21 17.1313V9.13135C21 6.36993 18.7614 4.13135 16 4.13135ZM19.25 17.1313C19.2445 18.9239 17.7926 20.3758 16 20.3813H8C6.20735 20.3758 4.75549 18.9239 4.75 17.1313V9.13135C4.75549 7.3387 6.20735 5.88684 8 5.88135H16C17.7926 5.88684 19.2445 7.3387 19.25 9.13135V17.1313ZM16.75 9.38135C17.3023 9.38135 17.75 8.93363 17.75 8.38135C17.75 7.82907 17.3023 7.38135 16.75 7.38135C16.1977 7.38135 15.75 7.82907 15.75 8.38135C15.75 8.93363 16.1977 9.38135 16.75 9.38135ZM12 8.63135C9.51472 8.63135 7.5 10.6461 7.5 13.1313C7.5 15.6166 9.51472 17.6313 12 17.6313C14.4853 17.6313 16.5 15.6166 16.5 13.1313C16.5027 11.937 16.0294 10.7909 15.1849 9.94643C14.3404 9.10194 13.1943 8.62869 12 8.63135ZM9.25 13.1313C9.25 14.6501 10.4812 15.8813 12 15.8813C13.5188 15.8813 14.75 14.6501 14.75 13.1313C14.75 11.6125 13.5188 10.3813 12 10.3813C10.4812 10.3813 9.25 11.6125 9.25 13.1313Z"
                      fill="black"
                    />
                  </svg>
                  Instagram
                </a>

                <a href="#" className="flex gap-3">
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.1761 5.13135H19.9362L13.9061 11.9087L21 21.1313H15.4456L11.0951 15.5379L6.11723 21.1313H3.35544L9.80517 13.8821L3 5.13135H8.69545L12.6279 10.244L17.1761 5.13135ZM16.2073 19.5067H17.7368L7.86441 6.67063H6.2232L16.2073 19.5067Z"
                      fill="black"
                    />
                  </svg>
                  X
                </a>
                <a href="#" className="flex gap-3">
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.5 4.13135C3.67157 4.13135 3 4.80292 3 5.63135V20.6313C3 21.4597 3.67157 22.1313 4.5 22.1313H19.5C20.3284 22.1313 21 21.4597 21 20.6313V5.63135C21 4.80292 20.3284 4.13135 19.5 4.13135H4.5ZM8.52076 8.13407C8.52639 9.09032 7.81061 9.67954 6.96123 9.67532C6.16107 9.6711 5.46357 9.03407 5.46779 8.13548C5.47201 7.29032 6.13998 6.6111 7.00764 6.63079C7.88795 6.65048 8.52639 7.29595 8.52076 8.13407ZM12.2797 10.8931H9.75971H9.7583V19.4529H12.4217V19.2532C12.4217 18.8733 12.4214 18.4933 12.4211 18.1132C12.4203 17.0994 12.4194 16.0845 12.4246 15.071C12.426 14.8249 12.4372 14.569 12.5005 14.3341C12.7381 13.4566 13.5271 12.8899 14.4074 13.0292C14.9727 13.1177 15.3467 13.4454 15.5042 13.9784C15.6013 14.3116 15.6449 14.6702 15.6491 15.0176C15.6605 16.0652 15.6589 17.1128 15.6573 18.1605C15.6567 18.5303 15.6561 18.9003 15.6561 19.2701V19.4515H18.328V19.2462C18.328 18.7942 18.3278 18.3423 18.3275 17.8904C18.327 16.7609 18.3264 15.6314 18.3294 14.5015C18.3308 13.991 18.276 13.4876 18.1508 12.994C17.9638 12.2599 17.5771 11.6524 16.9485 11.2137C16.5027 10.9015 16.0133 10.7004 15.4663 10.6779C15.404 10.6754 15.3412 10.672 15.2781 10.6686C14.9984 10.6534 14.7141 10.6381 14.4467 10.692C13.6817 10.8453 13.0096 11.1954 12.5019 11.8127C12.4429 11.8835 12.3852 11.9554 12.2991 12.0627L12.2797 12.087V10.8931ZM5.68164 19.4557H8.33242V10.8987H5.68164V19.4557Z"
                      fill="black"
                    />
                  </svg>
                  Linkedin
                </a>
              </div>
            </div> */}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-black text-center">
          <p className="text-black">
            © {new Date().getFullYear()} TechSkims. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
