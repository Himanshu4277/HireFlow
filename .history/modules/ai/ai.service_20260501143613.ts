

export async function parseResume(file: File) {
  try {
    const pdfParseModule = await import("pdf-parse-new");
    const pdfParse = pdfParseModule.default || pdfParseModule;

    // convert file → buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // extract text
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    if (!text) {
      throw new Error("Could not extract text from PDF");
    }
    try {
      return await aiParse(text);
    } catch (err) {
      console.log("⚠️ AI failed, using fallback...");
      return basicParse(text);
    }

    // send to OpenAI
  } catch (error: any) {
    console.error("Parsing failed:", error.message);
    throw new Error(error.message);
  }
}

export async function aiParse(text: string) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a resume parser. Extract structured data."
          },
          {
            role: "user",
            content: `
Extract the following from this resume:

1. Full Name
2. Skills (array)
3. Experience summary
4. Education
5. Key strengths

Return ONLY JSON format like:
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
      }),
    });

    const aiData = await response.json();

    if (!response.ok) {
      throw new Error(aiData.error?.message || "OpenAI failed");
    }

    const result = aiData.choices[0].message.content;

    // ⚠️ sometimes AI adds ```json → remove it
    const clean = result.replace(/```json|```/g, "").trim();

    return JSON.parse(clean);

  } catch (error: any) {
    console.error("AI parsing failed:", error.message);
    throw new Error(error.message);
  }
}

export async function basicParse(text: string) {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";

  const skillsList = [
    "JavaScript", "TypeScript", "React", "Next.js",
    "Node.js", "MongoDB", "SQL", "Python", "Java",
    "C++", "HTML", "CSS"
  ];

  const foundSkills = skillsList.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return {
    name: text.split("\n")[0] || "Unknown",
    skills: foundSkills,
    experience: text.slice(0, 300),
    education: text.includes("Bachelor") ? "Bachelor Degree" : "",
    strengths: foundSkills.slice(0, 3)
  };
}