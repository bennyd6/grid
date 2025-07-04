import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const SectionCard = ({ title, subtitle, description, link, list }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: 1 }}
    whileTap={{ scale: 0.95 }}
    className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 border border-zinc-600 text-white rounded-xl p-6 shadow-xl hover:shadow-2xl hover:border-cyan-500 transition-all duration-300"
  >
    <h3 className="text-xl font-bold text-cyan-400">{title}</h3>
    {subtitle && <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>}
    {description && <p className="mt-2 text-sm text-zinc-300">{description}</p>}
    {list && ( // Render list if provided (e.g., for experience points)
      <ul className="mt-2 list-disc list-inside text-sm text-zinc-300 space-y-1">
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )}
    {link && (
      <a
        href={link}
        className="inline-block mt-3 text-cyan-300 text-sm underline hover:text-cyan-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit →
      </a>
    )}
  </motion.div>
);

const Template2 = ({ data: propPortfolio, userId }) => {
  const [portfolio, setPortfolio] = useState(propPortfolio);
  const [loading, setLoading] = useState(!propPortfolio);
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
          // Clone the response so its body stream can be read multiple times
          const clonedResponse = response.clone();
          let errorData;
          try {
            errorData = await response.json(); // Try reading from original response
          } catch (jsonError) {
            // If original response couldn't be parsed as JSON, read text from the cloned response
            errorData = await clonedResponse.text();
          }
          throw new Error(errorData.message || errorData || `Failed to fetch portfolio with status: ${response.status}`);
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
    if (userId) {
      fetchPortfolioData();
    } else if (!propPortfolio) {
      fetchPortfolioData();
    } else {
      setPortfolio(propPortfolio);
      setLoading(false);
    }
  }, [propPortfolio, userId]);

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

  const transformedProjects = projects.map(p => ({
    title: p.title,
    description: p.description,
    link: p.link,
  }));

  const transformedExperiences = experience.map(e => ({
    title: e.title,
    subtitle: `${e.company || ''}${e.company && e.duration ? ' · ' : ''}${e.duration || ''}`,
    description: e.description,
  }));

  const transformedAchievements = achievements.map(a => ({
    title: a,
  }));

  const transformedEducation = education.map(edu => ({
    title: edu.degree,
    subtitle: `${edu.institution || ''}${edu.institution && edu.year ? ' · ' : ''}${edu.year || ''}`,
  }));

  const staticLinks = [
    { title: "GitHub", link: "#" },
    { title: "LinkedIn", link: "#" },
    { title: "Portfolio", link: "#" },
    { title: "YouTube", link: "#" },
  ];

  return (
    <main className="bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center space-y-4 px-6 py-16">
        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <h1 className="text-5xl font-extrabold text-cyan-300">{name || '[Your Full Name]'}</h1>
          <p className="text-lg text-zinc-400">
            {email && <>📧 {email}</>} {email && phone && " | "} {phone && <>📞 {phone}</>}
          </p>
          {summary && <p className="text-sm italic text-zinc-500 mt-2">"{summary}"</p>}
        </motion.div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="min-h-screen px-6 py-16 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">🧠 Skills</h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" className="grid md:grid-cols-3 gap-10">
            {skills.map((skill, i) => (
              <motion.div key={i} variants={fadeIn}>
                <SectionCard title={skill} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Projects */}
      {transformedProjects.length > 0 && (
        <section className="min-h-screen px-6 py-16 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">🧪 Projects</h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" className="grid md:grid-cols-3 gap-10">
            {transformedProjects.map((p, i) => (
              <motion.div key={i} variants={fadeIn}>
                <SectionCard {...p} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Experience */}
      {transformedExperiences.length > 0 && (
        <section className="min-h-screen px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">💼 Experience</h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" className="grid md:grid-cols-2 gap-10">
            {transformedExperiences.map((e, i) => (
              <motion.div key={i} variants={fadeIn}>
                <SectionCard {...e} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Education */}
      {transformedEducation.length > 0 && (
        <section className="min-h-screen px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">🎓 Education</h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" className="grid md:grid-cols-2 gap-10">
            {transformedEducation.map((edu, i) => (
              <motion.div key={i} variants={fadeIn}>
                <SectionCard {...edu} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Achievements */}
      {transformedAchievements.length > 0 && (
        <section className="min-h-screen px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">🏆 Achievements</h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" className="grid md:grid-cols-3 gap-10">
            {transformedAchievements.map((a, i) => (
              <motion.div key={i} variants={fadeIn}>
                <SectionCard {...a} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Links (using static links for now, add to schema if dynamic) */}
      {staticLinks.length > 0 && (
        <section className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">🔗 Links</h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {staticLinks.map((l, i) => (
              <motion.div key={i} variants={fadeIn}>
                <SectionCard title={l.title} link={l.link} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center text-sm text-zinc-500 py-10">
        Designed with 🔥 by {name || '[Your Name]'} · React + Tailwind + Framer Motion
      </footer>
    </main>
  );
};

export default Template2;
