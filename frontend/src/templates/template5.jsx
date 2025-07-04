import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Template5 now accepts 'data' (from TemplateDisplay preview) and 'userId' (from PublicTemplateWrapper)
const Template5 = ({ data: propPortfolio, userId }) => { // Added userId prop
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

  // Helper for section titles
  const SectionTitle = ({ children }) => (
    <motion.h2
      variants={fadeIn}
      className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b border-gray-300 pb-4 inline-block"
    >
      {children}
    </motion.h2>
  );

  return (
    <main className="font-inter bg-white text-gray-900 min-h-full overflow-x-hidden">
      {/* Header/Hero Section */}
      <motion.header
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gray-100 border-b border-gray-200"
      >
        <motion.h1 variants={fadeIn} className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
          {name || "Your Name"}
        </motion.h1>
        {summary && (
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mt-4">
            {summary}
          </motion.p>
        )}
        {(email || phone) && (
          <motion.p variants={fadeIn} className="text-md md:text-lg text-gray-600 mt-6">
            {email && <span className="mr-4">✉️ {email}</span>}
            {phone && <span>📞 {phone}</span>}
          </motion.p>
        )}
      </motion.header>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-white border-b border-gray-200">
          <SectionTitle>Skills</SectionTitle>
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
                className="bg-gray-200 text-gray-800 text-lg font-medium px-6 py-3 rounded-md shadow-sm
                           hover:bg-gray-300 transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </section>
      )}

      {/* Experience Section */}
      {experience.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-gray-50 border-b border-gray-200">
          <SectionTitle>Experience</SectionTitle>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-10 max-w-4xl w-full"
          >
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-md border border-gray-200
                           hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{exp.title || "Position"}</h3>
                <p className="text-lg text-gray-700 mb-4">{exp.company || "Company"} | {exp.duration || "Duration"}</p>
                {exp.description && <p className="text-base text-gray-600 leading-relaxed">{exp.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-white border-b border-gray-200">
          <SectionTitle>Projects</SectionTitle>
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
                className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200
                           hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{proj.title || "Project Title"}</h3>
                {proj.description && <p className="text-sm text-gray-700 leading-relaxed mb-4">{proj.description}</p>}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 hover:underline text-base font-medium"
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
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-gray-50 border-b border-gray-200">
          <SectionTitle>Education</SectionTitle>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-10 max-w-4xl w-full"
          >
            {education.map((edu, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-white p-8 rounded-lg shadow-md border border-gray-200
                           hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{edu.degree || "Degree"}</h3>
                <p className="text-lg text-gray-700">{edu.institution || "Institution"} | {edu.year || "Year"}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <section className="min-h-screen flex flex-col items-center justify-center py-16 px-8 bg-white border-b border-gray-200">
          <SectionTitle>Achievements</SectionTitle>
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
                className="text-gray-800 text-lg bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200
                           hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-center"
              >
                <span className="text-2xl mr-3">✨</span> {ach}
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
        className="text-center text-sm text-gray-600 py-10 bg-gray-100 border-t border-gray-200"
      >
        <p className="text-base text-gray-700 mb-1">© {new Date().getFullYear()} {name || "Your Name"}. All rights reserved.</p>
        <p className="text-sm text-gray-500">Crafted with simplicity and elegance.</p>
      </motion.footer>
    </main>
  );
};

export default Template5;
