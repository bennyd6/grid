const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyDfdyyRwBDSMcCA9NlA6XCqtFH4r3Sy92w';

module.exports = async function parseWithGemini(resumeText) {
const prompt = `
You are an expert resume parser. From the following resume text, extract the following fields and return them in strict minified JSON format compatible with the following schema:

{
  "name": "Full Name",
  "email": "user@example.com",
  "phone": "1234567890",
  "summary": "Brief professional summary",
  "skills": ["Skill1", "Skill2", "Skill3"],
  "achievements": ["Achievement1", "Achievement2"],
  "projects": [
    {
      "title": "Project Title",
      "description": "Short description",
      "link": "https://link-to-project.com"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University or College Name",
      "year": "Year of completion"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "duration": "Start - End",
      "description": "Role responsibilities and achievements"
    }
  ],
  "links": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username"
  }
}

Use empty strings or empty arrays for any missing fields.
Do NOT include any explanation, markdown, or extra formatting — just return the JSON object.

Resume Text:
"""${resumeText}"""
`;


  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('No JSON found in Gemini response');

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('Gemini API Error:', err.message);
    throw new Error('Failed to parse resume with Gemini');
  }
};