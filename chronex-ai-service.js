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
      enabled: true,
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
    openaiKey: process.env.OPENAI_API_KEY || null,
    huggingfaceKey: process.env.HUGGINGFACE_API_KEY || null,
    customKey: process.env.CHRONEX_API_KEY || null,
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

// ============ CHRONEX AI SERVICE CLASS ============
class ChronexAI {
  constructor(config = CHRONEX_CONFIG) {
    this.config = config;
    this.conversationHistory = [];
    this.cache = new Map();
    this.uid = null;
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
    // Detect message type
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

  // C++ backend (performance-critical operations)
  // Detect message type
  detectMessageType(message) {
    const msg = message.toLowerCase();

    if (msg.includes("code") || msg.includes("function") || msg.includes("javascript") || msg.includes("python")) {
      return "code";
    }
    if (msg.includes("solve") || msg.includes("calculate") || msg.includes("=") || msg.includes("math")) {
      return "math";
    }
    if (msg.includes("?") || msg.includes("what") || msg.includes("how") || msg.includes("why") || msg.includes("explain")) {
      return "question";
    }
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("greetings")) {
      return "greeting";
    }

    return "general";
  }

  // Code analysis
  analyzeCode(message) {
    const languages = this.config.capabilities.languageSupport;
    let response = "📝 **Code Analysis**\n\n";

    // Detect language
    const detectedLang = languages.find(lang => message.toLowerCase().includes(lang.toLowerCase()));

    if (detectedLang) {
      response += `**Language Detected:** ${detectedLang}\n\n`;
      response += `**Analysis:**\n`;
      response += `• Code structure appears well-organized\n`;
      response += `• Check for edge cases and error handling\n`;
      response += `• Consider performance optimization\n`;
      response += `• Add comments for complex logic\n\n`;
      response += `**Suggestions:**\n`;
      response += `• Use meaningful variable names\n`;
      response += `• Follow language-specific conventions\n`;
      response += `• Add unit tests\n`;
    }

    return response;
  }

  // Math solving
  solveMath(message) {
    return `🔢 **Math Solution**\n\nI can help solve mathematical problems! Please provide a specific equation or problem.\n\n**Supported:**\n• Algebra\n• Calculus\n• Statistics\n• Geometry\n• Linear Algebra`;
  }

  // Answer questions
  answerQuestion(message) {
    return `❓ **Answer**\n\nThat's a great question! I can help you explore this topic further.\n\n**Capabilities:**\n• Explain concepts\n• Provide examples\n• Suggest resources\n• Break down complex ideas`;
  }

  // Handle greetings
  handleGreeting(message) {
    const greetings = [
      "Hey there! 👋 I'm Chronex AI, your intelligent assistant. How can I help you today?",
      "Hello! Welcome to Chronex AI! What would you like to know? 🤖",
      "Greetings! I'm ready to assist you with any questions or tasks. 💡",
      "Hi! Great to meet you! What can I help you with? 🚀",
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // General response
  generateGeneralResponse(message) {
    return `💬 **Response**\n\nThanks for your message! I'm Chronex AI, and I can help with:\n• Code analysis and suggestions\n• Mathematical problems\n• Answering questions\n• Writing assistance\n• Data analysis\n\nWhat would you like to explore?`;
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
