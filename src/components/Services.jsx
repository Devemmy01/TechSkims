const Services = () => {
  const services = [
    {
      icon: "fas fa-network-wired",
      title: "Network Services",
      description: "Complete network solutions including design, installation, and maintenance for reliable business infrastructure."
    },
    {
      icon: "fas fa-desktop",
      title: "Onsite Support",
      description: "Professional IT support at your location with rapid response times and expert technicians."
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Remote Support",
      description: "Instant technical assistance and problem resolution through secure remote connections."
    },
    {
      icon: "fas fa-shield-alt",
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your business from modern digital threats."
    },
    {
      icon: "fas fa-server",
      title: "Infrastructure Setup",
      description: "Complete hardware and software deployment services for your business needs."
    },
    {
      icon: "fas fa-wifi",
      title: "Wireless Solutions",
      description: "Professional WiFi installation and heat mapping for optimal coverage and performance."
    },
    {
      icon: "fas fa-users-cog",
      title: "Staff Augmentation",
      description: "Flexible IT staffing solutions to supplement your existing team or project needs."
    },
    {
      icon: "fas fa-globe",
      title: "Website Services",
      description: "Custom website design and development to establish your digital presence."
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-navy-blue">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="text-center">
                <i className={`${service.icon} text-4xl text-sky-blue mb-4`}></i>
                <h3 className="text-xl font-semibold mb-3 text-navy-blue">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
              <div className="mt-4 text-center">
                <a href="#contact" className="text-sky-blue hover:text-navy-blue transition duration-300 text-sm font-medium">
                  Learn More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services; 