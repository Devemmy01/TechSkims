import { Link } from "react-router-dom";

import React from "react";
import avatar from "../assets/Avatar.png";

const Section = () => {
  return (
    <div>
      <section className="bg-[#001F3E] flex flex-col gap-10 pb-20 w-full md:flex-row text-[40px] text-white p-5 md:p-20">
        <h1 className="font-[700] max-w-xl text-[26px] md:text-[40px] pt-14 md:pt-0">
          Empowering Businesses Through Advanced Field Service Management
          Solutions.
        </h1>

        <div className="flex flex-col gap-2 max-w-[30rem] justify-end">
          <p className="text-base">
            Our rapid growth is a testament to our commitment to excellence.
            With a focus on client success, we deliver measurable results in
            every project.
          </p>

          <div className="flex flex-col gap-5 md:flex-row mt-5">
            <div className="grid gap-2">
              <h1 className="font-[700] text-[48px] text-white">75%</h1>
              <p className="text-base">
                Increase in client satisfaction over the last year.
              </p>
            </div>
            <div className="grid gap-2">
              <h1 className="font-[700] text-[48px] text-white">90%</h1>
              <p className="text-base">
                Projects completed on time and within budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white flex flex-col items-center justify-center gap-10 pb-20 w-full text-[40px] text-white p-5 md:p-20 mt-16 md:mt-0">
        <svg
          width="116"
          height="19"
          viewBox="0 0 116 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_411_9517)">
            <path
              d="M9.07088 0.612343C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612343Z"
              fill="black"
            />
            <path
              d="M33.0709 0.612343C33.4146 -0.204115 34.5854 -0.204114 34.9291 0.612346L36.9579 5.43123C37.1029 5.77543 37.4306 6.01061 37.8067 6.0404L43.0727 6.45748C43.9649 6.52814 44.3267 7.62813 43.6469 8.2034L39.6348 11.5987C39.3482 11.8412 39.223 12.2218 39.3106 12.5843L40.5363 17.661C40.744 18.5211 39.7969 19.201 39.033 18.7401L34.5245 16.0196C34.2025 15.8252 33.7975 15.8252 33.4755 16.0196L28.967 18.7401C28.2031 19.201 27.256 18.5211 27.4636 17.661L28.6894 12.5843C28.777 12.2218 28.6518 11.8412 28.3653 11.5987L24.3531 8.2034C23.6733 7.62813 24.0351 6.52814 24.9273 6.45748L30.1934 6.0404C30.5695 6.01061 30.8972 5.77543 31.0421 5.43123L33.0709 0.612343Z"
              fill="black"
            />
            <path
              d="M57.0709 0.612343C57.4146 -0.204115 58.5854 -0.204114 58.9291 0.612346L60.9579 5.43123C61.1029 5.77543 61.4306 6.01061 61.8067 6.0404L67.0727 6.45748C67.9649 6.52814 68.3267 7.62813 67.6469 8.2034L63.6348 11.5987C63.3482 11.8412 63.223 12.2218 63.3106 12.5843L64.5363 17.661C64.744 18.5211 63.7969 19.201 63.033 18.7401L58.5245 16.0196C58.2025 15.8252 57.7975 15.8252 57.4755 16.0196L52.967 18.7401C52.2031 19.201 51.256 18.5211 51.4636 17.661L52.6894 12.5843C52.777 12.2218 52.6518 11.8412 52.3653 11.5987L48.3531 8.2034C47.6733 7.62813 48.0351 6.52814 48.9273 6.45748L54.1934 6.0404C54.5695 6.01061 54.8972 5.77543 55.0421 5.43123L57.0709 0.612343Z"
              fill="black"
            />
            <path
              d="M81.0706 0.612343C81.4144 -0.204115 82.5851 -0.204114 82.9289 0.612346L84.9576 5.43123C85.1026 5.77543 85.4303 6.01061 85.8064 6.0404L91.0724 6.45748C91.9646 6.52814 92.3264 7.62813 91.6466 8.2034L87.6345 11.5987C87.348 11.8412 87.2228 12.2218 87.3103 12.5843L88.5361 17.661C88.7438 18.5211 87.7966 19.201 87.0328 18.7401L82.5243 16.0196C82.2023 15.8252 81.7973 15.8252 81.4752 16.0196L76.9667 18.7401C76.2029 19.201 75.2557 18.5211 75.4634 17.661L76.6892 12.5843C76.7767 12.2218 76.6516 11.8412 76.365 11.5987L72.3528 8.2034C71.673 7.62813 72.0348 6.52814 72.927 6.45748L78.1931 6.0404C78.5693 6.01061 78.8969 5.77543 79.0418 5.43123L81.0706 0.612343Z"
              fill="black"
            />
            <path
              d="M105.071 0.612343C105.414 -0.204115 106.585 -0.204114 106.929 0.612346L108.958 5.43123C109.103 5.77543 109.43 6.01061 109.806 6.0404L115.072 6.45748C115.965 6.52814 116.326 7.62813 115.647 8.2034L111.635 11.5987C111.348 11.8412 111.223 12.2218 111.31 12.5843L112.536 17.661C112.744 18.5211 111.797 19.201 111.033 18.7401L106.524 16.0196C106.202 15.8252 105.797 15.8252 105.475 16.0196L100.967 18.7401C100.203 19.201 99.2557 18.5211 99.4634 17.661L100.689 12.5843C100.777 12.2218 100.652 11.8412 100.365 11.5987L96.3528 8.2034C95.673 7.62813 96.0348 6.52814 96.927 6.45748L102.193 6.0404C102.569 6.01061 102.897 5.77543 103.042 5.43123L105.071 0.612343Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_411_9517">
              <rect width="116" height="18.8889" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <h2 className="text-[24px] font-[700] mt-0 text-black text-center max-w-[768px]">
          "The team transformed our field service operations, making them more
          efficient and reliable. Their expertise has been invaluable to our
          growth and success."
        </h2>

        <div className="flex gap-4">
          <img src={avatar} alt="" />
          <div className="grid text-black">
            <p className="text-base font-[600]">Jane Doe</p>
            <p className="text-base font-[400]">CEO, Tech Innovations</p>
          </div>
        </div>
      </section>

      <section className="bg-white flex flex-col w-full items-center justify-center p-5 md:p-20">
        <div className="bg-[#04203D] w-full p-[28px] rounded-[20px] flex flex-col md:flex-row justify-between">
          <div className="font-[700] text-white text-[32px] md:text-[40px]">
            Reach Out to Us Today
          </div>
          <Link to="/contact" className="h-[50px] flex items-center px-5 rounded-full bg-[#00A8E8] w-fit text-base mt-5 text-white font-normal">
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Section;