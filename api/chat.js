import { formidable } from "formidable";
import fs from "fs";
import { promisify } from "util";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = promisify(fs.readFile);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable(); // ✅ Fix here

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing file." });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    try {
      const imageBuffer = await readFile(file[0].filepath); // ✅ notice file[0]
      const base64Image = imageBuffer.toString("base64");
      const mimeType = file[0].mimetype;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that describes images.",
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                  },
                },
                {
                  type: "text",
                  text: "What is this image?",
                },
              ],
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const description = data?.choices?.[0]?.message?.content;

      return res.status(200).json({ text: description || "No description found." });
    } catch (error) {
      console.error("OpenAI Error:", error);
      return res.status(500).json({ error: "Failed to analyze image." });
    }
  });
}
