

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
    
}