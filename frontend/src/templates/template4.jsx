import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 10 } },
};

const headerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  // Corrected the ease value to a valid one, using "easeOut" for simplicity.
  show: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
};

// Template4 now accepts 'data' (from TemplateDisplay preview) and 'userId' (from PublicTemplateWrapper)
const Template4 = ({ data: propPortfolio, userId }) => { // Added userId prop
  const [portfolio, setPortfolio] = useState(propPortfolio); // Initialize with prop data if available
  const [loading, setLoading] = useState(!propPortfolio); // Set loading based on prop data presence
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = '';
        let headers = {};

        if (userId) { // If userId is provided (from public link)
          apiUrl = `https://grid-15d6.onrender.com/api/auth/portfolio/${userId}`;
          // No auth-token needed for public route
        } else { // If no userId (from TemplateDisplay preview or direct protected route)
          const token = localStorage.getItem('token');
          if (!token) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
          }
          apiUrl = 'https://grid-15d6.onrender.com/api/auth/myportfolio';
          headers = { 'auth-token': token };
        }

        const response = await fetch(apiUrl, { headers });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch portfolio from ${apiUrl}`);
        }

        const data = await response.json();
        setPortfolio(data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Determine when to fetch:
    // 1. If userId is present (public view), always fetch.
    // 2. If propPortfolio is NOT provided (direct protected route access), fetch.
    // 3. If propPortfolio IS provided (TemplateDisplay preview), use it directly and don't fetch.
    if (userId) {
      fetchPortfolioData();
    } else if (!propPortfolio) {
      fetchPortfolioData();
    } else {
      setPortfolio(propPortfolio);
      setLoading(false);
    }
  }, [propPortfolio, userId]); // Re-run effect if propPortfolio or userId changes

  if (loading) return <p className="text-center p-4 text-gray-300">Loading portfolio...</p>;
  if (error) return <p className="text-center p-4 text-red-500">Error: {error}</p>;
  if (!portfolio) return <p className="text-center p-4 text-gray-300">No portfolio data available.</p>;

  const {
    name,
    email,
    phone,
    summary,
    skills = [],
    projects = [],
    experience = [],
    achievements = [],
    education = [],
  } = portfolio;

  return (
    <main className="font-inter bg-black text-gray-100 min-h-full overflow-x-hidden">
      {/* Header/Hero Section */}
      <motion.header
        initial="hidden"
        animate="show"
        variants={headerVariants}
        className="min-h-screen flex flex-col items-center justify-center text-center p-8
                   bg-gradient-to-br from-gray-900 via-black to-zinc-950 shadow-2xl relative overflow-hidden" // Updated gradient
      >
        {/* Background blobs for visual interest */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <motion.div variants={containerVariants} className="z-10 relative">
          <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 tracking-tight leading-tight">
            {name || "Your Name"}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 mb-6 font-light">
            {email && <span className="mr-4">✉️ {email}</span>}
            {phone && <span>📞 {phone}</span>}
          </motion.p>
          {summary && (
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mt-6">
              {summary}
            </motion.p>
          )}
        </motion.div>
      </motion.header>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-zinc-950 border-t border-gray-800"> {/* Darker background */}
          <h2 className="text-5xl font-bold text-cyan-400 mb-12 drop-shadow-lg">Skills</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full"
          >
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-800 p-5 rounded-lg shadow-xl flex items-center justify-center text-center
                           hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700" // Darker card
              >
                <p className="text-lg font-medium text-gray-100">{skill}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Experience Section */}
      {experience.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-black border-t border-gray-800"> {/* Darker background */}
          <h2 className="text-5xl font-bold text-green-400 mb-12 drop-shadow-lg">Experience</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-10 max-w-5xl w-full"
          >
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800
                           hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300" // Darker card
              >
                <h3 className="text-3xl font-bold text-white mb-2">{exp.title || "Position"}</h3>
                <p className="text-xl text-gray-400 mb-4">{exp.company || "Company"} | {exp.duration || "Duration"}</p>
                {exp.description && <p className="text-lg text-gray-300 leading-relaxed">{exp.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-zinc-950 border-t border-gray-800"> {/* Darker background */}
          <h2 className="text-5xl font-bold text-purple-400 mb-12 drop-shadow-lg">Projects</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full"
          >
            {projects.map((proj, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700
                           hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300" // Darker card
              >
                <h3 className="text-2xl font-bold text-white mb-3">{proj.title || "Project Title"}</h3>
                {proj.description && <p className="text-md text-gray-300 leading-relaxed mb-4">{proj.description}</p>}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-purple-300 hover:underline text-lg font-medium"
                  >
                    View Project →
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-black border-t border-gray-800"> {/* Darker background */}
          <h2 className="text-5xl font-bold text-red-400 mb-12 drop-shadow-lg">Education</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-10 max-w-5xl w-full"
          >
            {education.map((edu, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800
                           hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300" // Darker card
              >
                <h3 className="text-3xl font-bold text-white mb-2">{edu.degree || "Degree"}</h3>
                <p className="text-xl text-gray-400">{edu.institution || "Institution"} | {edu.year || "Year"}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-zinc-950 border-t border-gray-800"> {/* Darker background */}
          <h2 className="text-5xl font-bold text-yellow-400 mb-12 drop-shadow-lg">Achievements</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
          >
            {achievements.map((ach, i) => (
              <motion.p
                key={i}
                variants={itemVariants}
                className="text-gray-200 text-xl bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700
                           hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-center" // Darker card
              >
                <span className="text-3xl mr-3">🌟</span> {ach}
              </motion.p>
            ))}
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <motion.footer
        initial="hidden"
        animate="show"
        variants={itemVariants}
        className="text-center text-sm text-gray-500 py-10 bg-black border-t border-gray-800" // Darker footer
      >
        <p className="text-base text-gray-400 mb-1">© {new Date().getFullYear()} {name || "Your Name"}. All rights reserved.</p>
        <p className="text-sm text-gray-600">Crafted with ❤️ using React, Tailwind CSS, and Framer Motion</p>
      </motion.footer>

      {/* Tailwind CSS keyframes for blob animation */}
      <style>
        {`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        `}
      </style>
    </main>
  );
};

export default Template4;
