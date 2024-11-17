const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/12038185237"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white h-16 w-16 flex items-center justify-center rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50"
      aria-label="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp text-3xl"></i>
    </a>
  );
};

export default WhatsAppButton; 