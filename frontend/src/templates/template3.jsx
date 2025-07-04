import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Template3 now accepts 'data' (from TemplateDisplay preview) and 'userId' (from PublicTemplateWrapper)
const Template3 = ({ data: propPortfolio, userId }) => {
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

  if (loading) return <p className="text-center p-4 text-gray-700">Loading portfolio...</p>;
  if (error) return <p className="text-center p-4 text-red-600">Error: {error}</p>;
  if (!portfolio) return <p className="text-center p-4 text-gray-700">No portfolio data available. Please create one.</p>;

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
    <main className="font-inter bg-gray-50 text-gray-800 min-h-full overflow-x-hidden">
      {/* Header Section - Updated Style */}
      <motion.header
        initial="hidden"
        animate="show"
        variants={fadeIn}
        className="min-h-screen flex flex-col items-center justify-center text-center p-8
                   bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white shadow-2xl" // Changed gradient colors
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight"> {/* Changed text color to white */}
          {name || "Your Name"}
        </h1>
        {(email || phone) && (
          <p className="text-lg md:text-xl text-indigo-200 mb-6"> {/* Adjusted text color for contrast */}
            {email && <span className="mr-4">✉️ {email}</span>}
            {phone && <span>📞 {phone}</span>}
          </p>
        )}
        {summary && <p className="text-md md:text-lg text-indigo-100 max-w-4xl mx-auto leading-relaxed">{summary}</p>} {/* Adjusted text color for contrast */}
      </motion.header>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-white shadow-inner">
          <h2 className="text-4xl font-bold text-blue-700 mb-10 border-b-4 border-blue-300 pb-3">Skills</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-wrap justify-center gap-4 max-w-5xl"
          >
            {skills.map((skill, i) => (
              <motion.span
                key={i}
                variants={fadeIn}
                className="bg-blue-600 text-white text-lg font-medium px-6 py-3 rounded-full shadow-md
                           hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </section>
      )}

      {/* Experience Section */}
      {experience.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-gray-50 shadow-inner">
          <h2 className="text-4xl font-bold text-green-700 mb-10 border-b-4 border-green-300 pb-3">Experience</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8 max-w-4xl w-full"
          >
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-100
                           hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900">{exp.title || "Position"}</h3>
                <p className="text-lg text-gray-700 mt-1">{exp.company || "Company"} | {exp.duration || "Duration"}</p>
                {exp.description && <p className="mt-4 text-gray-600 text-base leading-relaxed">{exp.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-white shadow-inner">
          <h2 className="text-4xl font-bold text-purple-700 mb-10 border-b-4 border-purple-300 pb-3">Projects</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
          >
            {projects.map((proj, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-gray-50 p-6 rounded-lg shadow-lg border border-gray-100
                           hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900">{proj.title || "Project Title"}</h3>
                {proj.description && <p className="mt-3 text-gray-600 text-sm leading-relaxed">{proj.description}</p>}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-purple-600 hover:underline text-base font-medium"
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
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-gray-50 shadow-inner">
          <h2 className="text-4xl font-bold text-red-700 mb-10 border-b-4 border-red-300 pb-3">Education</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8 max-w-4xl w-full"
          >
            {education.map((edu, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-100
                           hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900">{edu.degree || "Degree"}</h3>
                <p className="text-lg text-gray-700 mt-1">{edu.institution || "Institution"} | {edu.year || "Year"}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-white shadow-inner">
          <h2 className="text-4xl font-bold text-yellow-700 mb-10 border-b-4 border-yellow-300 pb-3">Achievements</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full"
          >
            {achievements.map((ach, i) => (
              <motion.p
                key={i}
                variants={fadeIn}
                className="text-gray-700 text-lg bg-yellow-100 p-5 rounded-lg shadow-md border border-yellow-200
                           hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-center"
              >
                <span className="text-2xl mr-3">🏆</span> {ach}
              </motion.p>
            ))}
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <motion.footer
        initial="hidden"
        animate="show"
        variants={fadeIn}
        className="text-center text-sm text-gray-500 py-10 bg-gray-100 border-t border-gray-200"
      >
        <p className="text-base text-gray-600 mb-1">© {new Date().getFullYear()} {name || "Your Name"}. All rights reserved.</p>
        <p className="text-sm text-gray-500">Built with React and Tailwind CSS</p>
      </motion.footer>
    </main>
  );
};

export default Template3;
