// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";

// dotenv.config();

// const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

// async function main() {
//   const result = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });

//   const response = await result.response;
//   const text = await response.text();
//   console.log(text);
// }

// main().catch(console.error);