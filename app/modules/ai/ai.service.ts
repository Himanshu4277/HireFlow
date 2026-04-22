export async function parseResumeWithCVParse(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://api.cvparse.io/parse", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CVPARSE_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      throw new Error(`CVParse API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return data;

  } catch (error: any) {
    console.error("Resume parsing failed:", error.message);

    throw new Error(error.message || "Something went wrong in resume parsing");
  }
}