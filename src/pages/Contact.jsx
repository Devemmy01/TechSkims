import { useState } from "react";
import bg from "../assets/bg.png";
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);

      const response = await axios.post('https://beta.techskims.tech/api/send-message', formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: response.data.data || 'Message sent successfully!' },
        });

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({
        submitted: false,
        submitting: false,
        info: {
          error: true,
          msg: error.response?.data?.message || error.message || "An error occurred. Please try again later.",
        },
      });
    }
  };

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
          Contact Us
        </h2>
      </section>

      <div className="bg-[#F7FBFF] flex flex-col md:flex-row items-center justify-center w-full gap-10 md:gap-20 p-16">
        <div className="grid gap-2">
          <svg
            className="mx-auto"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.3998 8.3999C6.4156 8.3999 4.7998 10.0157 4.7998 11.9999V23.9999C4.7998 25.9841 6.4156 27.5999 8.3998 27.5999H27.5998C29.584 27.5999 31.1998 25.9841 31.1998 23.9999V11.9999C31.1998 10.0157 29.584 8.3999 27.5998 8.3999H8.3998ZM8.3998 9.5999H27.5998C28.9396 9.5999 29.9998 10.6601 29.9998 11.9999V23.9999C29.9998 25.3397 28.9396 26.3999 27.5998 26.3999H8.3998C8.08396 26.4023 7.7708 26.3419 7.47854 26.2221C7.18627 26.1023 6.92075 25.9256 6.69741 25.7023C6.47407 25.479 6.29738 25.2134 6.17761 24.9212C6.05785 24.6289 5.99741 24.3157 5.9998 23.9999V11.9999C5.9998 10.6601 7.06 9.5999 8.3998 9.5999Z"
              fill="#00A8E8"
            />
            <path
              d="M9.01766 12.0002C8.93596 11.9979 8.85465 12.0123 8.77871 12.0425C8.70278 12.0728 8.63382 12.1182 8.57606 12.176C8.46358 12.2886 8.40039 12.4411 8.40039 12.6002C8.40039 12.7593 8.46358 12.9119 8.57606 13.0244L15.7761 20.2244C16.9995 21.4484 19.0011 21.4484 20.2245 20.2244L27.4245 13.0244C27.5369 12.9119 27.6001 12.7593 27.6001 12.6002C27.6001 12.4411 27.5369 12.2886 27.4245 12.176C27.3119 12.0636 27.1594 12.0004 27.0003 12.0004C26.8412 12.0004 26.6886 12.0636 26.5761 12.176L19.3761 19.376C19.196 19.5578 18.9817 19.702 18.7456 19.8005C18.5094 19.8989 18.2561 19.9496 18.0003 19.9496C17.7444 19.9496 17.4911 19.8989 17.255 19.8005C17.0188 19.702 16.8045 19.5578 16.6245 19.376L9.42446 12.176C9.31626 12.0677 9.17073 12.0048 9.01766 12.0002Z"
              fill="#00A8E8"
            />
          </svg>

          <p className="text-[#1a1a1a] font-[600]">contact@techskims.tech</p>
        </div>

        <div className="grid gap-4">
          <svg
            className="mx-auto"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.28 24C15.0933 24 12.96 23.6 10.88 22.8C8.69333 21.9467 6.76 20.6667 5.08 18.96C3.4 17.2533 2.10667 15.3067 1.2 13.12C0.4 11.04 0 8.90667 0 6.72C0 5.49333 0.306667 4.37333 0.92 3.36C1.53333 2.34667 2.34667 1.53333 3.36 0.92C4.37333 0.306667 5.49333 0 6.72 0C7.04 0 7.25333 0.16 7.36 0.480001L10.4 8C10.4533 8.16 10.44 8.33333 10.36 8.52C10.28 8.70667 10.16 8.82667 10 8.88L6.72 10.24C6.77333 11.4667 7.12 12.6133 7.76 13.68C8.4 14.7467 9.25333 15.6 10.32 16.24C11.3867 16.88 12.5333 17.2267 13.76 17.28L15.12 14C15.1733 13.84 15.2933 13.72 15.48 13.64C15.6667 13.56 15.84 13.5467 16 13.6L23.52 16.64C23.84 16.7467 24 16.96 24 17.28C24 18.5067 23.6933 19.6267 23.08 20.64C22.4667 21.6533 21.6533 22.4667 20.64 23.08C19.6267 23.6933 18.5067 24 17.28 24ZM6.24 1.44C4.90667 1.54667 3.77333 2.10667 2.84 3.12C1.90667 4.13333 1.44 5.33333 1.44 6.72C1.44 8.85333 1.84 10.88 2.64 12.8C3.44 14.72 4.58667 16.4267 6.08 17.92C7.57333 19.4133 9.28 20.56 11.2 21.36C13.12 22.16 15.1467 22.56 17.28 22.56C18.6667 22.56 19.8667 22.0933 20.88 21.16C21.8933 20.2267 22.4533 19.0933 22.56 17.76L16.16 15.2L14.88 18.32C14.7733 18.5867 14.56 18.72 14.24 18.72C12.64 18.72 11.1467 18.32 9.76 17.52C8.37333 16.72 7.28 15.6267 6.48 14.24C5.68 12.8533 5.28 11.36 5.28 9.76C5.28 9.44 5.41333 9.22667 5.68 9.12L8.8 7.84L6.24 1.44Z"
              fill="#00A8E8"
            />
          </svg>

          <p className="text-[#1a1a1a] font-[600]">+1 2038185237</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-[15rem]">
        <h2 className="text-center text-[24px] md:text-[32px] font-bold">
          Reach Out To Us Today
        </h2>
        <div className="max-w-xl mx-auto">
          <form className="space-y-6 mt-5" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Name"
                className="w-full px-4 py-2 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-blue"
              />

              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-blue"
              />
            </div>

            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Subject"
              className="w-full px-4 py-2 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-blue"
            />

            <div>
              <textarea
                id="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Type your message"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              ></textarea>
            </div>

            {status.info.msg && (
              <div
                className={`text-center p-2 rounded-md ${
                  status.info.error
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {status.info.msg}
              </div>
            )}

            <button
              type="submit"
              disabled={status.submitting}
              className={`w-full bg-sky-blue text-white py-2 px-4 rounded-full hover:bg-sky-700 transition duration-300 ${
                status.submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {status.submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
