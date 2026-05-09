export async function parseResume(file: File) {
  try {
    const pdfParseModule = await import("pdf-parse-new");
    const pdfParse = pdfParseModule.default || pdfParseModule;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      throw new Error("Could not extract text from PDF");
    }

    try {
      return await aiParse(text);
    } catch (err) {
      console.log("⚠️ AI failed, using fallback...");
      return basicParse(text);
    }

  } catch (error: any) {
    console.error("Parsing failed:", error.message);
    throw new Error(error.message || "Resume parsing failed");
  }
}

export async function aiParse(text: string) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are a professional resume parser. Extract structured resume data in pure JSON.",
            },
            {
              role: "user",
              content: `
Extract the following from this resume:

1. Full Name
2. Skills (IMPORTANT: extract ALL skills including soft skills)
3. Experience summary
4. Education
5. Key strengths

Return ONLY valid JSON.

Format:
{
  "name": "",
  "skills": [],
  "experience": "",
  "education": "",
  "strengths": []
}

Resume:
${text}
              `,
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    const aiData = await response.json();

    if (!response.ok) {
      console.error("Groq error:", aiData);
      throw new Error(aiData?.error?.message || "AI parsing failed");
    }

    const content = aiData?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Invalid AI response");
    }

    // Remove markdown formatting if present
    const clean = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(clean);
    } catch {
      console.error("Invalid JSON returned:", clean);
      throw new Error("AI returned invalid JSON");
    }

  } catch (error: any) {
    console.error("AI parsing failed:", error.message);
    throw new Error(error.message || "AI parsing failed");
  }
}

export function basicParse(text: string) {
  const email =
    text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";

  const skillsList = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "SQL",
    "Python",
    "Java",
    "C++",
    "HTML",
    "CSS",
  ];

  const foundSkills = skillsList.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return {
    name: text.split("\n")[0]?.trim() || "Unknown",
    email,
    skills: foundSkills,
    experience: text.slice(0, 300),
    education: text.includes("Bachelor")
      ? "Bachelor Degree"
      : text.includes("Master")
      ? "Master Degree"
      : "",
    strengths: foundSkills.slice(0, 3),
  };
}

can we no need to export analyze resume here ?