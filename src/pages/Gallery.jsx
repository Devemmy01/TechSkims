import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import bg from "../assets/bg.png";
import Section from "../components/Section";

const Gallery = () => {
  const [services, setServices] = useState({});
  const [gallery, setGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch services and gallery data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesResponse = await fetch(
          "https://beta.techskims.tech/api/services"
        );
        const servicesData = await servicesResponse.json();
        console.log("Services Data:", servicesData); // Debugging API response

        // Fetch gallery
        const galleryResponse = await fetch(
          "https://beta.techskims.tech/api/gallery"
        );
        const galleryData = await galleryResponse.json();
        console.log("Gallery Data:", galleryData); // Debugging API response

        // Validate servicesData structure
        if (
          servicesData.status === "success" &&
          Array.isArray(servicesData.data)
        ) {
          const servicesArray = servicesData.data;

          // Organize images by service category
          const serviceImages = {};
          if (
            galleryData.status === "success" &&
            Array.isArray(galleryData.data)
          ) {
            servicesArray.forEach((service) => {
              serviceImages[service.name] = galleryData.data.filter(
                (image) => image.service === service.name
              );
            });
          } else {
            console.error("Gallery data is not an array:", galleryData);
          }

          setServices(serviceImages);
        } else {
          console.error("Unexpected structure in servicesData:", servicesData);
        }

        // Validate galleryData structure
        if (
          galleryData.status === "success" &&
          Array.isArray(galleryData.data)
        ) {
          setGallery(galleryData.data);
        } else {
          console.error("Unexpected galleryData structure:", galleryData);
          setGallery([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedImages =
    selectedCategory === "all"
      ? gallery
      : Array.isArray(services[selectedCategory])
      ? services[selectedCategory]
      : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
    );
  }

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

      <section className="container mx-auto px-4 py-8 mt-10">
        {/* Navigation */}
        <div className="flex gap-4 mb-8 items-center justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === "all"
                ? "bg-[#00a6e8] hover:bg-[#00a6e8]/80 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            View all
          </button>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
            >
              Category
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                {Object.keys(services).map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex flex-col md:flex-row mx-auto items-center justify-center pt-5 flex-wrap w-full gap-4">
          {displayedImages.map((image, index) => (
            <div key={index} className="rounded-lg">
              <img
                src={image.image}
                alt={image.description || `Service ${index + 1}`}
                className="w-[300px] h-[300px] object-cover transition-transform hover:scale-105 rounded-lg"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14">
        <Section />
      </div>
    </>
  );
};

export default Gallery;
