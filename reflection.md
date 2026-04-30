# Reflection: Persona-Based AI Chatbot

Building the persona-based AI chatbot was an excellent deep dive into the practical application of prompt engineering and working with LLM APIs in a production-like environment. The project brought the core concepts of the assignment—system prompts, context switching, the GIGO principle, and API integration—into a tangible experience.

### What Worked Well

The persona switching mechanism turned out to be quite effective. By completely resetting the chat history and injecting a carefully crafted system prompt specific to the active persona whenever a tab changed, the LLM consistently stayed in character. 
Using Next.js App Router for the backend API worked nicely for making server-side calls to the Generative AI model. It shielded the API keys from the client-side while allowing streaming implementations (or quick text completions) through simple JSON APIs. The use of few-shot prompting alongside clear constraints proved to be the most vital factor in shaping the output. Without the few-shot examples, the model would often produce standard, helpful-bland responses. 

### The GIGO Principle in Action

The "Garbage In, Garbage Out" (GIGO) principle became glaringly obvious during the initial test runs. My first pass at Anshuman's prompt was just: "You are Anshuman Singh, act like an ex-Facebook engineer." The results were highly generic and mostly unhelpful, often breaking character and apologizing like a typical AI. 
Once I enhanced the prompt with detailed background context, explicit communication traits (e.g., "direct, challenging"), and embedded few-shot conversations, the quality of the generated text skyrocketed. The prompt instructed the model to "reason step-by-step internally", forcing a chain-of-thought process that improved the accuracy and depth of its technical responses. The LLM simply mirrored the effort I put into the prompt. Small, lazy instructions yielded lazy results; deep, nuanced instructions yielded a convincing persona.

### Areas for Improvement

If I were to take this project further, I would implement streaming for the AI responses. While the typing indicator currently gives the user feedback that an API request is happening, displaying the text as it streams token-by-token would make the chatbot feel noticeably more conversational and faster.
Additionally, I would improve the contextual memory. Right now, the bot forgets everything if you switch personas and switch back. Building a robust state management system that caches the chat history for each persona during the session would significantly improve the user experience. I would also add more robust error handling and perhaps rate-limiting on the API routes.
