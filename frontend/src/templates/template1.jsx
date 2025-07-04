import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const Card = ({ children }) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      rotate: [0, 1, -1, 0],
      boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.2)",
    }}
    transition={{ duration: 0.4 }}
    className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl border border-white/20 transition-all duration-300"
  >
    {children}
  </motion.div>
);

// Template1 now accepts 'data' (from TemplateDisplay preview) and 'userId' (from PublicTemplateWrapper)
const Template1 = ({ data: propPortfolio, userId }) => {
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

  if (loading) return <p className="text-center p-4">Loading portfolio...</p>;
  if (error) return <p className="text-center p-4 text-red-600">Error: {error}</p>;
  if (!portfolio) return <p className="text-center p-4">No portfolio data available. Please create one.</p>;

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
    <main className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth bg-gradient-to-br from-[#F0F4FF] via-[#EAF7F5] to-[#F8EAFD] text-gray-800 font-sans px-4">

      {/* Hero - only if at least one of these exists */}
      {(name || email || phone || summary) && (
        <section className="snap-start h-screen flex flex-col items-center justify-center text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            {name && <h1 className="text-5xl font-bold text-indigo-600">{name}</h1>}
            {(email || phone) && (
              <p className="mt-2 text-gray-600 text-lg">
                {email && <>📧 {email}</>} {email && phone && " | "} {phone && <>📞 {phone}</>}
              </p>
            )}
            {summary && <p className="text-md mt-3 text-gray-700 max-w-2xl mx-auto">{summary}</p>}
          </motion.div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="snap-start h-screen py-12 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-blue-500 mb-8">🧠 Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full px-4">
            {skills.map((skill, i) => (
              <Card key={i}>
                <p className="text-md text-gray-700 text-center font-medium">{skill}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="snap-start h-screen py-12 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-blue-500 mb-8">🧪 Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
            {projects.map((p, i) => (
              <Card key={i}>
                {p.title && <h3 className="text-xl font-bold text-indigo-700">{p.title}</h3>}
                {p.description && <p className="mt-2 text-gray-700 text-sm">{p.description}</p>}
                {p.link && (
                  <a
                    href={p.link}
                    className="mt-3 inline-block text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project →
                  </a>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="snap-start h-screen py-12 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-blue-500 mb-8">💼 Experience</h2>
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
            {experience.map((e, i) => (
              <Card key={i}>
                {e.title && ( // Assuming 'title' is the role
                  <h3 className="text-lg font-bold text-indigo-700">{e.title}</h3>
                )}
                {(e.company || e.duration) && (
                  <p className="text-sm text-gray-600">
                    {e.company} {e.company && e.duration && " | "} {e.duration}
                  </p>
                )}
                {e.description && (
                  <p className="mt-2 text-sm text-gray-700">{e.description}</p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="snap-start h-screen py-12 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-blue-500 mb-8">🎓 Education</h2>
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
            {education.map((edu, i) => (
              <Card key={i}>
                {edu.degree && <h3 className="text-lg font-bold text-indigo-700">{edu.degree}</h3>}
                {edu.institution && <p className="text-sm text-gray-600">{edu.institution}</p>}
                {edu.year && <p className="text-sm text-gray-600">{edu.year}</p>}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="snap-start h-screen py-12 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-blue-500 mb-8">🏆 Achievements</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
            {achievements.map((a, i) => (
              <Card key={i}>
                <p className="text-md text-gray-700">{a}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <section className="snap-start h-screen flex items-center justify-center px-6 bg-gradient-to-t from-indigo-100 via-white to-indigo-200">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center">
          <p className="text-lg font-medium text-gray-700">💡 Keep Building. Keep Shipping. 🚀</p>
          <p className="text-sm text-gray-500 mt-2">
            Crafted with React, Tailwind, Framer Motion ✨
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default Template1;
