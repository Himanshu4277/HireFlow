import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

export async function analyzeResume(text: string) {
    const response = await groq.chat.completions.create({
        model: "llama3-70b-8192",  
        messages: [
            {
                role: "system",
                content: `
You are an expert resume coach.

Analyze the resume and return JSON:

{
  "feedback": "overall feedback",
  "improvements": ["point1", "point2"],
  "better_resume": "rewritten professional resume"
}
        `,
            },
            {
                role: "user",
                content: text,
            },
        ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error("AI returned empty response");
    }
     
    const clean = content.replace(/```json|```/g, "").trim();

    return JSON.parse(clean);
}