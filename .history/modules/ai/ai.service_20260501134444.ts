

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

    // send to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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