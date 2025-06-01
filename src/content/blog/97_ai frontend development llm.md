---
title: "Learn the Basics of AI/LLMs and Build a Simple React App with OpenAI API"
description: "AI is a part of our life now, we need to learn what they are and how they work, the objective of this post is to get into that."
category: ["typescript", "ai", "react"]
pubDate: "2025-06-01"
published: true
---

## Table of contents

# Introduction

Wy should we care about AI?

It's rapidly transforming how web interfaces are designed, developed, and optimized. AI enhances frontend development by automating repetitive tasks like code generation, debugging, and testing, which boosts efficiency and reduces errors. It also enables more personalized and adaptive user experiences by analyzing user behavior to tailor content, layouts, and navigation dynamically. Additionally, AI-powered tools assist in creating responsive designs, improving accessibility, and streamlining collaboration between designers and developers. Embracing AI allows frontend engineers to focus on higher-level creative and strategic work, delivering smarter, more user-friendly applications while staying competitive in a fast-evolving digital landscape.

In this post lets learn about AI on the surface, checking out the concepts surrounding it that we as developers care about, it will be theoretical at first.

# Large Language Model

## What is a Large Language Model (LLM)?

An LLM, or **L**arge **L**anguage **M**odel, is an advanced type of artificial intelligence algorithm designed to understand, generate, and interpret human language by leveraging deep learning techniques and massive datasets. It typically contains billions of parameters—variables learned during training—that enable it to grasp the nuances and complexities of language.

LLMs are built on transformer neural network architectures, which use mechanisms like self-attention to weigh the importance of different words in context, allowing the model to generate coherent and contextually relevant text. These models have evolved from earlier language models by dramatically expanding the scale of data and parameters, resulting in significantly enhanced capabilities for natural language processing tasks such as text generation, summarization, translation, and sentiment analysis

## LLMs as a Concept of Development

From a development perspective, LLMs represent a transformative leap in how software and AI systems are created and evolved. The development of an LLM involves stages such as data collection, model selection, training, fine-tuning, and evaluation, all grounded in machine learning and natural language processing principles. This process enables the creation of versatile AI tools that can accelerate innovation and productivity across many domains.

LLMs are not just AI models but foundational tools **driving** development forward by automating language-based tasks, enhancing human-machine interaction, and unlocking new potentials in software engineering and beyond

APIs like OpenAI’s work by providing a standardized interface that allows developers to send requests to powerful AI models hosted on OpenAI’s servers and receive intelligent responses in return. Essentially, the OpenAI API acts as a bridge between your application and OpenAI’s pre-trained AI models, enabling you to integrate advanced AI capabilities such as natural language understanding, text generation, image creation, and speech recognition without needing to build or train these models yourself.

# How OpenAI API Works

- **Client-Server Model:** Your application (the client) sends a request to OpenAI’s servers containing input data, typically in the form of text prompts or instructions. This request is made via standard HTTP calls, often RESTful, which makes it easy to integrate into various programming environments.

- **Authentication:** To use the API, you need an API key that authenticates your requests, ensuring secure and authorized access to the models.

- **Request Parameters:** When making a call, you specify parameters such as:

  - The AI model to use (e.g., GPT-4, GPT-3.5, DALL·E).
  - The input prompt or data.
  - Optional settings like `max_tokens` (to control response length), `temperature` (to adjust randomness or creativity), and `top_p` (to control diversity of output).

- **Processing:** OpenAI’s servers process the input using the selected model, leveraging deep learning algorithms trained on vast datasets to generate a relevant and coherent output.

- **Response:** The API returns the generated output—such as text completions, answers, or images—which your application can then use or display[1][4].

## Advanced Features

- **Stateful Interactions:** The API supports multi-turn conversations by using previous responses as context for the next input, enabling chatbots or assistants to maintain coherent dialogues.

- **Function Calling:** Developers can extend the API’s capabilities by defining functions that the model can invoke to fetch data or perform actions, integrating AI with external systems or databases seamlessly.

- **Versatile Models:** Beyond text generation, the API offers models for image generation (DALL·E), speech-to-text (Whisper), and text embeddings for semantic search or classification.

## Summary

OpenAI’s API democratizes access to sophisticated AI by abstracting the complexity of machine learning model training and deployment. Developers simply send prompts and parameters via API calls and receive AI-generated outputs, enabling rapid integration of AI features into applications across industries, from chatbots and content creation to data analysis and automation.

# Understanding tokens, temperature, max tokens, roles (system/user/assistant)

Here is an explanation of key concepts used in OpenAI’s API interactions: tokens, temperature, max tokens, and the roles system/user/assistant.

## Tokens

Tokens are the basic units of text that the model processes. A token can be as short as one character or as long as one word or part of a word. For example, "ChatGPT is great!" might be split into tokens like ["Chat", "G", "PT", " is", " great", "!"]. Models have limits on how many tokens they can handle in input and output combined, so managing tokens is crucial for efficient use.

## Temperature

Temperature is a parameter that controls the randomness or creativity of the model’s output. It ranges typically from 0 to 1 (sometimes higher).

- A low temperature (close to 0) makes the model’s responses more deterministic and focused, often repeating the most likely answers.
- A higher temperature (closer to 1) makes outputs more diverse and creative, allowing for more varied or unexpected responses.

## Max Tokens

Max tokens sets the maximum length of the model’s generated response in tokens. It limits how long the output can be, helping control cost and response size. For example, if max tokens is set to 100, the model will generate up to 100 tokens in its reply.

## Roles in Messages

The OpenAI API uses three main roles to structure conversations and guide the model’s behavior:

- **System:** Provides high-level instructions or context that set the behavior, tone, or rules for the assistant throughout the conversation. It acts like a director setting the stage. For example, “You are a helpful assistant that speaks formally.”
- **User:** Represents the human input or prompt. This is what the end-user asks or instructs the assistant to do. For example, “Explain how photosynthesis works.”
- **Assistant:** Represents the AI model’s responses generated based on the conversation history and instructions. This is what the model outputs as answers or completions.

# Prompt engineering basics (zero-shot, few-shot, chain-of-thought)

Prompt engineering is the practice of designing and refining input prompts to guide AI models, especially large language models (LLMs), to generate desired and high-quality outputs. It involves crafting clear, specific, and context-rich instructions that help the AI understand the task and produce relevant responses.

## Key Prompt Engineering Techniques

### Zero-shot prompting

In zero-shot prompting, the model is given a task without any examples or prior context—just a direct instruction or question. The AI must rely solely on its pre-trained knowledge to generate a response. This approach tests the model’s ability to generalize and perform tasks it hasn’t been explicitly shown before.

Example:

```
“Translate the following sentence into French: ‘Hello, how are you?’”
Here, the model responds based on its training without seeing any example translations.
```

### Few-shot prompting

Few-shot prompting provides the model with a few examples of the task along with the prompt. These examples demonstrate the desired input-output pattern, helping the model understand the task better and generate more accurate responses. This technique leverages the model’s ability to learn from context within the prompt itself.

Example:

```
“Translate these sentences into French:
English: ‘Good morning.’ French: ‘Bonjour.’
English: ‘Thank you.’ French: ‘Merci.’
English: ‘How are you?’ French:”
The model then completes the last translation based on the pattern.
```

### Chain-of-thought prompting

Chain-of-thought prompting encourages the model to generate a step-by-step reasoning process before giving the final answer. This technique improves performance on complex tasks that require logical deduction, calculation, or multi-step problem solving by making the model’s reasoning explicit.

Example:

```
“If there are 3 apples and you buy 2 more, how many apples do you have? Think step-by-step.”
The model might respond: “3 apples plus 2 apples equals 5 apples. So, you have 5 apples.”
```

# Tools and Libraries

## Open API

The OpenAI API provides access to powerful pre-trained AI models like GPT (for text generation), DALL·E (for image generation), Codex (for code generation), and others supporting tasks such as summarization, translation, speech-to-text, and embeddings. It enables developers to integrate sophisticated AI capabilities into their apps via simple API calls without needing to train models themselves. Features include function calling, fine-tuning, and vision capabilities for image input and understanding.

Quick example:

```javascript
// Creating the instance
import axios from "axios";

const openai = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  },
});

export default openai;
```

Now to use it:

```javascript
import { useState } from "react";
import openai from "../utils/openaiClient";

const PromptInput = ({ onResponse }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await openai.post("/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      onResponse(res.data.choices[0].message.content);
    } catch (error) {
      onResponse("Error fetching response from AI.");
    }
    setLoading(false);
  };

  return (
    <div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>
    </div>
  );
};

export default PromptInput;
```

As you can see, its quite easy to use this API, the problem is that it costs you money.

## Langchain.js

LangChain.js is a modular JavaScript framework designed to simplify building applications powered by large language models. It helps developers manage prompts, build complex multi-step workflows (chains), integrate external data (retrieval-augmented generation), and create intelligent agents that can reason and take actions. LangChain.js also supports production features like monitoring (LangSmith) and scalable deployment (LangGraph Cloud). It abstracts much of the complexity involved in orchestrating LLMs and related components, making it easier to develop reliable and maintainable AI apps.

A quick example, its easy to use as well:

```javascript
import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

async function run() {
  // Initialize the OpenAI model with your API key
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
  });

  // Define a prompt template
  const prompt = new PromptTemplate({
    template: "Translate this English text to French: {text}",
    inputVariables: ["text"],
  });

  // Create an LLMChain with the model and prompt
  const chain = new LLMChain({ llm: model, prompt });

  // Run the chain with input text
  const response = await chain.run({ text: "Hello, how are you?" });

  console.log("Response:", response);
}

run();
```

We can run this in the backend as well and return this as a response.

Let's check what's going on:

- OpenAI: Connects to the OpenAI API using your API key.

- PromptTemplate: Defines a reusable prompt with a placeholder {text}.

- LLMChain: Combines the prompt and the model into a chain that can be executed.

- chain.run(): Executes the chain with the input, here translating English to French.

# Building a Prompt Explorer using React, Vite, Tailwind and Open AI API

## Key Features:

- Input field for prompts
- Submit button
- Display area for AI output
- Loading spinner while waiting
- Error handling

## Setting up the API

```tsx
// api/aiApi.ts
import axios from "axios";

export interface PromptRequest {
  prompt: string;
}

export interface PromptResponse {
  content: string;
}

const openai = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  },
});

export const fetchAiResponse = async (
  data: PromptRequest
): Promise<PromptResponse> => {
  const response = await openai.post("/chat/completions", {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: data.prompt }],
  });

  return {
    content: response.data.choices[0].message.content,
  };
};
```

## Building the mutation using React Query

```tsx
// hooks/useAiQuery.ts
import { useMutation } from "@tanstack/react-query";
import { fetchAiResponse, PromptRequest, PromptResponse } from "../api/aiApi";

export const useAiQuery = () => {
  return useMutation<PromptResponse, Error, PromptRequest>({
    mutationFn: fetchAiResponse,
  });
};
```

## Implementing the Prompt Input component

```tsx
// components/PromptInput.tsx
import React, { useState } from "react";
import { useAiQuery } from "../hooks/useAiQuery";
import { PromptRequest } from "../api/aiApi";

interface PromptInputProps {
  onResponse: (response: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ onResponse }) => {
  const [prompt, setPrompt] = useState<string>("");
  const { mutate, isPending, error } = useAiQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    mutate(
      { prompt },
      {
        onSuccess: (data) => {
          onResponse(data.content);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8">
      <div className="mb-4">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter your prompt:
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI something..."
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none h-32 bg-white text-gray-900"
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
          isPending ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={isPending}
      >
        {isPending ? "Thinking..." : "Ask AI"}
      </button>

      {error && (
        <p className="mt-4 text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
};

export default PromptInput;
```

## Display the response on App

```tsx
// App.tsx
import React, { useState } from "react";
import PromptInput from "./components/PromptInput";

const App: React.FC = () => {
  const [response, setResponse] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        AI Prompt Explorer
      </h1>
      <PromptInput onResponse={setResponse} />

      {response && (
        <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            AI Response:
          </h2>
          <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
};

export default App;
```

# Conclusion

Knowing about AI and building tools using the Open API toolset is a very useful experience to you, you can add this project into your Github, since it will impress recruiters and developers who will like that you're keeping yourself up to date with modern techs.

We will be building more cool projects using AI, so stay tuned!

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
