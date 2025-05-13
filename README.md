# AI Image Recognition

Upload or snap a photo and AI will tell you what it is.

## Details:

- Secure backend hosted on **Vercel**
- Hidden API Key setup
- Working AI logic powered by **GPT-4o** for recognition
- Simple UI with JavaScript functionality
- Accept multipart/form-data (an uploaded image)
- Convert it to base64 or a compatible format
- Send it to OpenAI's chat/completions endpoint with image_url or image input
- Return the model's response

## Local Run:

- Test locally, run "vercel dev"
- Make sure to install "npm install formidable"