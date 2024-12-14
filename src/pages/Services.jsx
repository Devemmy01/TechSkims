import { useEffect, useState } from "react";
import bg from "../assets/bg.png";
import axios from "axios";
import {
  NetworkIcon,
  FieldServiceIcon,
  RemoteSupportIcon,
  SecurityIcon,
  InfrastructureIcon,
  WirelessIcon,
  OnsiteSupportIcon,
  WebsiteIcon,
} from "../components/ServiceIcons";
import Section from "../components/Section";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getIconComponent = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes('network')) return <NetworkIcon />;
    if (name.includes('field') || name.includes('vending')) return <FieldServiceIcon />;
    if (name.includes('remote')) return <RemoteSupportIcon />;
    if (name.includes('security') || name.includes('cyber')) return <SecurityIcon />;
    if (name.includes('infrastructure')) return <InfrastructureIcon />;
    if (name.includes('wireless') || name.includes('wifi')) return <WirelessIcon />;
    if (name.includes('onsite') || name.includes('staff')) return <OnsiteSupportIcon />;
    if (name.includes('website')) return <WebsiteIcon />;
    return <NetworkIcon />; // default icon
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("https://beta.techskims.tech/api/services");
        const servicesData = response.data.data || response.data;
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to fetch services");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!Array.isArray(services)) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        No services available
      </div>
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
          Our Services
        </h2>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:p-14 pb-5 bg-[#F7FBFF]">
        {services.map((service) => (
          <div
            key={service._id}
            className="p-6"
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {getIconComponent(service.name)}
              </div>
              <h3 className="text-[20px] md:text-[26px] font-[700] mb-3 text-black">
                {service.name}
              </h3>
              <p className="text-black text-[16px] md:text-[18px]">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <Section />
      </div>
    </>
  );
};

export default Services;
