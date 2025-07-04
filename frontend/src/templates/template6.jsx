import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15, duration: 0.8 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
};

const headerTextVariants = {
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] } }, // Custom ease for buttery feel
};

// Template6 now accepts 'data' (from TemplateDisplay preview) and 'userId' (from PublicTemplateWrapper)
const Template6 = ({ data: propPortfolio, userId }) => { // Added userId prop
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
          apiUrl = `http://localhost:3000/api/auth/portfolio/${userId}`;
          // No auth-token needed for public route
        } else { // If no userId (from TemplateDisplay preview or direct protected route)
          const token = localStorage.getItem('token');
          if (!token) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
          }
          apiUrl = 'http://localhost:3000/api/auth/myportfolio';
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

  if (loading) return <p className="text-center p-4 text-gray-700">Loading portfolio...</p>;
  if (error) return <p className="text-center p-4 text-red-500">Error: {error}</p>;
  if (!portfolio) return <p className="text-center p-4 text-gray-700">No portfolio data available.</p>;

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
    <main className="font-inter bg-black text-white min-h-full overflow-x-hidden relative">
      {/* Background gradient animation */}
      <div className="absolute inset-0 z-0 bg-gradient-animation"></div>

      {/* Header/Hero Section */}
      <motion.header
        initial="hidden"
        animate="show"
        variants={sectionVariants}
        className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative z-10"
      >
        <motion.h1
          variants={headerTextVariants}
          className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4 tracking-tight leading-tight drop-shadow-lg"
        >
          {name || "Your Name"}
        </motion.h1>
        {summary && (
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mt-6 font-light"
          >
            {summary}
          </motion.p>
        )}
        {(email || phone) && (
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 mt-8"
          >
            {email && <span className="mr-4">✉️ {email}</span>}
            {phone && <span>📞 {phone}</span>}
          </motion.p>
        )}
      </motion.header>

      {/* Skills Section */}
      {skills.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-black relative z-10 border-t border-gray-800"
        >
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-12 drop-shadow-lg">Skills</h2>
          <motion.div
            variants={sectionVariants}
            className="flex flex-wrap justify-center gap-6 max-w-6xl w-full"
          >
            {skills.map((skill, i) => (
              <motion.span
                key={i}
                variants={itemVariants}
                className="bg-gray-800 text-white text-xl font-medium px-8 py-4 rounded-full shadow-lg
                           hover:bg-gray-700 transform hover:scale-110 transition-all duration-300 cursor-pointer border border-gray-700"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Experience Section */}
      {experience.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-zinc-950 relative z-10 border-t border-gray-800"
        >
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-400 mb-12 drop-shadow-lg">Experience</h2>
          <motion.div
            variants={sectionVariants}
            className="space-y-12 max-w-5xl w-full"
          >
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-800 p-10 rounded-xl shadow-xl border border-gray-700
                           hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300"
              >
                <h3 className="text-3xl font-bold text-white mb-3">{exp.title || "Position"}</h3>
                <p className="text-xl text-gray-400 mb-5">{exp.company || "Company"} | {exp.duration || "Duration"}</p>
                {exp.description && <p className="text-lg text-gray-300 leading-relaxed">{exp.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-black relative z-10 border-t border-gray-800"
        >
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-12 drop-shadow-lg">Projects</h2>
          <motion.div
            variants={sectionVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl w-full"
          >
            {projects.map((proj, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700
                           hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{proj.title || "Project Title"}</h3>
                {proj.description && <p className="text-md text-gray-300 leading-relaxed mb-5">{proj.description}</p>}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-orange-300 hover:underline text-lg font-medium"
                  >
                    View Project →
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-zinc-950 relative z-10 border-t border-gray-800"
        >
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-12 drop-shadow-lg">Education</h2>
          <motion.div
            variants={sectionVariants}
            className="space-y-12 max-w-5xl w-full"
          >
            {education.map((edu, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-800 p-10 rounded-xl shadow-xl border border-gray-700
                           hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300"
              >
                <h3 className="text-3xl font-bold text-white mb-2">{edu.degree || "Degree"}</h3>
                <p className="text-xl text-gray-400">{edu.institution || "Institution"} | {edu.year || "Year"}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-black relative z-10 border-t border-gray-800"
        >
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-12 drop-shadow-lg">Achievements</h2>
          <motion.div
            variants={sectionVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full"
          >
            {achievements.map((ach, i) => (
              <motion.p
                key={i}
                variants={itemVariants}
                className="text-gray-200 text-xl bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700
                           hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-center"
              >
                <span className="text-3xl mr-4">🌟</span> {ach}
              </motion.p>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Footer */}
      <motion.footer
        initial="hidden"
        animate="show"
        variants={sectionVariants}
        className="text-center text-sm text-gray-500 py-10 bg-zinc-950 relative z-10 border-t border-gray-800"
      >
        <p className="text-base text-gray-400 mb-1">© {new Date().getFullYear()} {name || "Your Name"}. All rights reserved.</p>
        <p className="text-sm text-gray-600">Designed with passion and code.</p>
      </motion.footer>

      {/* Global styles for gradient animation */}
      <style>
        {`
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-gradient-animation {
          background: linear-gradient(270deg, #1a202c, #2d3748, #1a202c); /* Darker shades for subtle movement */
          background-size: 600% 600%;
          animation: gradient-animation 20s ease infinite;
        }
        `}
      </style>
    </main>
  );
};

export default Template6;
