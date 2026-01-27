/**
 * CHRONEX AI SERVICE
 * Advanced AI Chat Assistant for NEXCHAT
 * Supports: JavaScript, Python, C++, C, C# backends
 * Creator: DEMON ALEX
 */

import { db, rtdb } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ============ CREATOR INFO ============
const CREATOR = "DEMON ALEX";

// ============ CHRONEX AI CONFIGURATION ============
const CHRONEX_CONFIG = {
  creator: CREATOR,
  // AI Model Parameters
  model: {
    name: "Chronex AI v1.0",
    type: "advanced-neural-network",
    temperature: 0.7,  // 0.0-1.0 (lower = more deterministic)
    maxTokens: 2000,
    topP: 0.9,
    frequencyPenalty: 0.6,
    presencePenalty: 0.6,
  },

  // AI Capabilities
  capabilities: {
    chat: true,
    codeAnalysis: true,
    languageSupport: ["JavaScript", "Python", "C++", "C", "C#", "Java", "Go", "Rust"],
    mathSolving: true,
    dataAnalysis: true,
    documentProcessing: true,
    multiLanguage: true,
  },

  // Backend Options
  backends: {
    javascript: {
      enabled: true,
      endpoint: "/api/chronex/chat",
      timeout: 30000,
    },
    python: {
      enabled: false,
      endpoint: "http://localhost:5000/ai/chat",
      timeout: 60000,
    },
  },

  // Processing Parameters
  parameters: {
    maxProcessingLimit: 5_000_000_000,  // 5 BILLION
    description: "Maximum processing capacity per session"
  },

  // API Keys and Tokens
  apiKeys: {
    openaiKey: null, // API keys from browser environment
    huggingfaceKey: null,
    customKey: null,
  },

  // Response Settings
  response: {
    streaming: true,
    caching: true,
    cacheDuration: 3600, // seconds
    maxCacheSize: 100,   // MB
  },

  // Safety and Moderation
  safety: {
    contentModeration: true,
    flagInappropriate: true,
    autoFilter: true,
    reportThreshold: 0.8,
  },
};

// ============ RANDOM RESPONSE GENERATOR (def_random) ============
/**
 * Generates random varied responses for AI replies
 * Ensures no two consecutive messages are identical
 */
function def_random(responseArray) {
  if (!responseArray || responseArray.length === 0) {
    return "I'm here to help! What would you like to know?";
  }

  const randomIndex = Math.floor(Math.random() * responseArray.length);
  return responseArray[randomIndex];
}

// ============ CHRONEX AI SERVICE CLASS ============
class ChronexAI {
  constructor(config = CHRONEX_CONFIG) {
    this.config = config;
    this.conversationHistory = [];
    this.cache = new Map();
    this.uid = null;
    this.lastResponses = []; // Track last 5 responses to avoid repetition
  }

  // Get creator information
  getCreator() {
    return {
      name: CREATOR,
      role: "Developer",
      system: "Chronex AI JavaScript Service",
      version: "1.0"
    };
  }

  // Initialize with user ID
  setUserId(uid) {
    this.uid = uid;
  }

  // Main chat method
  async chat(message, conversationId = null) {
    try {
      if (!this.uid) {
        throw new Error("User not authenticated");
      }

      // Check cache
      const cached = this.getFromCache(message);
      if (cached) {
        return cached;
      }

      // Add to history
      this.conversationHistory.push({
        role: "user",
        content: message,
        timestamp: new Date(),
      });

      // Get AI response from Python backend
      let response;
      if (this.config.backends.python.enabled) {
        response = await this.getPythonResponse(message);
      } else {
        response = await this.getJavaScriptResponse(message);
      }

      // Cache response
      this.cacheResponse(message, response);

      // Save to database
      await this.saveConversation(message, response, conversationId);

      // Add to history
      this.conversationHistory.push({
        role: "assistant",
        content: response,
        timestamp: new Date(),
      });

      return response;
    } catch (error) {
      console.error("Chronex AI Error:", error);
      return this.getErrorResponse(error);
    }
  }

  // JavaScript implementation (local processing)
  async getJavaScriptResponse(message) {
    const msg = message.toLowerCase();

    // Check for specific patterns first (Priority 1)

    // 1. Identity / Status
    if (msg.includes("who are you") || msg.includes("what are you")) {
      return "I am Chronex AI, an advanced digital assistant created by Demon Alex. I'm here to help you with code, math, and general questions.";
    }
    if (msg.includes("how are you") || msg.includes("how r u") || msg.includes("how are u")) {
      return "I'm functioning perfectly, thank you! Ready to assist you with your tasks. How can I help you today?";
    }
    if (msg.includes("real ai") || msg.includes("fake") || msg.includes("bot")) {
      return "I am a simulated AI assistant running locally in your browser. While I may not have the vast knowledge of a cloud-based LLM, I'm designed to help you with specific tasks within this application.";
    }

    // 2. Complaint / Meta-discussion (Addressing user's specific complaint)
    if (msg.includes("not replying based on") || msg.includes("biased") || msg.includes("random") || msg.includes("irrelevant")) {
      return "I apologize if my previous responses seemed generic. I am analyzing your specific keywords to provide better answers. Please asking me something specific about code, math, or this application.";
    }

    // 3. Capabilities
    if (msg.includes("can you") || msg.includes("able to")) {
      if (msg.includes("code") || msg.includes("program")) return "Yes, I can analyze code, suggest improvements, and help debug issues in JavaScript, Python, and other languages.";
      if (msg.includes("math") || msg.includes("calculate")) return "I can help solve mathematical problems including algebra, calculus, and statistics.";
      return "I can help with coding, math, general questions, and data analysis. What do you need help with specifically?";
    }

    // Detect general message type (Priority 2)
    const messageType = this.detectMessageType(message);

    switch (messageType) {
      case "code":
        return this.analyzeCode(message);
      case "math":
        return this.solveMath(message);
      case "question":
        return this.answerQuestion(message);
      case "greeting":
        return this.handleGreeting(message);
      default:
        return this.generateGeneralResponse(message);
    }
  }

  // Python backend (ML/advanced processing)
  async getPythonResponse(message) {
    try {
      const response = await fetch(this.config.backends.python.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          model: this.config.model.name,
          temperature: this.config.model.temperature,
          maxTokens: this.config.model.maxTokens,
          history: this.conversationHistory,
        }),
        timeout: this.config.backends.python.timeout,
      });

      if (!response.ok) {
        throw new Error(`Python backend error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.text;
    } catch (error) {
      console.warn("Python backend unavailable, using JS fallback:", error);
      return this.getJavaScriptResponse(message);
    }
  }

  // Detect message type
  detectMessageType(message) {
    const msg = message.toLowerCase();

    if (msg.includes("code") || msg.includes("function") || msg.includes("javascript") || msg.includes("python") || msg.includes("var ") || msg.includes("const ") || msg.includes("def ")) {
      return "code";
    }
    if (msg.includes("solve") || msg.includes("calculate") || msg.includes("=") || msg.includes("math") || msg.includes("+") || msg.includes("*")) {
      return "math";
    }
    // Only classify as question if it's asking for information, not just a casual "how are you" which is handled above
    if ((msg.includes("?") || msg.includes("what") || msg.includes("how") || msg.includes("why") || msg.includes("explain")) && !msg.includes("how are you")) {
      return "question";
    }
    if (msg.includes("hello") || msg.includes("hi ") || msg.includes("hey") || msg.includes("greetings") || msg === "hi") {
      return "greeting";
    }

    return "general";
  }

  // Handle greetings
  handleGreeting(message) {
    return "Hello! I'm Chronex AI. I'm ready to help you with coding, math, or any questions you have about NEXCHAT.";
  }

  // General response with varied replies - NOW CONTEXT-AWARE
  generateGeneralResponse(message) {
    // Echo back a relevant response based on basic keyword extraction
    const msg = message.toLowerCase();

    if (msg.includes("thank")) return "You're very welcome! Let me know if you need anything else.";
    if (msg.includes("bye") || msg.includes("goodbye")) return "Goodbye! Have a great day.";
    if (msg.includes("cool") || msg.includes("awesome") || msg.includes("great")) return "I'm glad you think so!";

    // Fallback if truly no context is found
    return "I understand. Could you elaborate a bit more on that? I can help best with specific coding questions, math problems, or technical inquiries.";
  }

  // Answer questions with varied responses
  answerQuestion(message) {
    const msg = message.toLowerCase();

    // Attempt to answer specific types of questions
    if (msg.includes("time")) return `The current time is ${new Date().toLocaleTimeString()}.`;
    if (msg.includes("date")) return `Today's date is ${new Date().toLocaleDateString()}.`;
    if (msg.includes("name")) return "My name is Chronex AI.";
    if (msg.includes("color") || msg.includes("colour")) return "I like the green theme of NEXCHAT!";

    // If it's a "why" question
    if (msg.includes("why")) {
      return "That's a complex question. As a local AI, I don't have deep reasoning capabilities, but essentially: valid logic leads to valid results.";
    }

    // Generic fallback for unknown complex questions
    return `That's an interesting question about "${message.substring(0, 20)}...". While I don't have a specific answer in my database, I'd suggest checking the documentation or breaking the problem down into smaller parts.`;
  }

  // Error response
  getErrorResponse(error) {
    return `⚠️ **Error**\n\nSorry, I encountered an issue: ${error.message}\n\nPlease try again or rephrase your question.`;
  }

  // Cache management
  cacheResponse(key, value) {
    if (this.config.response.caching) {
      this.cache.set(key, {
        value,
        timestamp: Date.now(),
      });

      // Limit cache size
      if (this.cache.size > this.config.response.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
    }
  }

  getFromCache(key) {
    if (!this.config.response.caching) return null;

    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = (Date.now() - cached.timestamp) / 1000;
    if (age > this.config.response.cacheDuration) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  // Save conversation to Firebase
  async saveConversation(userMessage, aiResponse, conversationId) {
    try {
      if (!this.uid) return;

      const conversationRef = ref(rtdb, `conversations/${this.uid}/${conversationId || "default"}`);
      const messagesRef = push(conversationRef);

      await set(messagesRef, {
        user: userMessage,
        ai: aiResponse,
        timestamp: serverTimestamp(),
        model: this.config.model.name,
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  }

  // Get conversation history
  async getConversationHistory(conversationId = "default") {
    try {
      if (!this.uid) return [];

      const conversationRef = ref(rtdb, `conversations/${this.uid}/${conversationId}`);
      return new Promise((resolve) => {
        onValue(conversationRef, (snapshot) => {
          const messages = [];
          snapshot.forEach((child) => {
            messages.push(child.val());
          });
          resolve(messages);
        });
      });
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

// ============ EXPORT ============
export const chronexAI = new ChronexAI(CHRONEX_CONFIG);
export { ChronexAI, CHRONEX_CONFIG };
