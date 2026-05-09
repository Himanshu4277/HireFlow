import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function analyzeResume(text: string) {
  try {
    // Prevent token overflow
    const trimmedText = text.slice(0, 12000);

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",

      temperature: 0.3,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
You are an expert ATS resume coach.

Analyze the resume carefully and return ONLY valid JSON.

Required JSON format:

{
  "feedback": "overall feedback",
  "improvements": [
    "point1",
    "point2"
  ],
  "better_resume": "fully rewritten professional ATS optimized resume"
}

Rules:
- Never return markdown
- Never use \`\`\`
- Always return valid JSON
- Make the rewritten resume highly professional
- Improve grammar, formatting, impact, and ATS optimization
          `,
        },
        {
          role: "user",
          content: trimmedText,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI returned empty response");
    }

    try {
      return JSON.parse(content);
    } catch (err) {
      console.error("Invalid JSON from AI:", content);
      throw new Error("AI returned invalid JSON");
    }

  } catch (error: any) {
    console.error("Resume analysis failed:", error.message);

    throw new Error(
      error?.message || "Failed to analyze resume"
    );
  }
}