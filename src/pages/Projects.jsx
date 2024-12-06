import w1 from "../assets/w1 (1).jpg";
import w2 from "../assets/w1 (2).jpg";
import w3 from "../assets/w1 (3).jpg";
import w4 from "../assets/w1 (4).jpg";
import w5 from "../assets/w1 (5).jpg";
import w6 from "../assets/w1 (6).jpg";
import w7 from "../assets/w1 (7).jpg";
import w8 from "../assets/w1 (8).jpg";

const Projects = () => {
  const projects = [
    { id: 1, image: w1, alt: "Project 1" },
    { id: 2, image: w2, alt: "Project 2" },
    { id: 3, image: w3, alt: "Project 3" },
    { id: 4, image: w4, alt: "Project 4" },
    { id: 5, image: w5, alt: "Project 5" },
    { id: 6, image: w6, alt: "Project 6" },
    { id: 7, image: w7, alt: "Project 7" },
    { id: 8, image: w8, alt: "Project 8" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy-blue">
          Our executed projects speak volume
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={project.image}
                alt={project.alt}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
