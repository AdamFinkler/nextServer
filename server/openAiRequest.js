"use strict";
const { config } = require("dotenv");
const path = require("path");
config({ path: path.resolve(__dirname, "../.env") });


async function getResponseFromOpenAi(prompt) {
  try {
    const openaiModule = await import("openai");
    const OpenAI = openaiModule.default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    
    const answer = response.choices[0].message.content;
    return answer;
  } catch (error) {
    throw new Error(error)
  }
}


module.exports = getResponseFromOpenAi;
