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
    temperature: 0.7,
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
    python: {
      enabled: true,  // Enabled by default to try connecting to "Brain"
      endpoint: "http://localhost:5000/ai/chat",
      timeout: 10000, // Reduced timeout for faster fallback
    },
    cloud: {
      enabled: false,
      provider: "openai",
      apiKey: ""
    }
  },

  // Caching Settings
  response: {
    caching: true,
    cacheDuration: 3600, // 1 hour
    maxCacheSize: 100
  }
};

// ============ CHRONEX AI CLASS ============
class ChronexAI {
  constructor(config) {
    this.config = config;
    this.cache = new Map();
    this.conversationHistory = [];
    this.lastResponses = [];
    this.uid = null;
    console.log("🧠 Chronex AI Service Initialized");
  }

  setUserId(uid) {
    this.uid = uid;
  }

  // JavaScript implementation (local processing - ENHANCED)
  async getJavaScriptResponse(message) {
    const msg = message.toLowerCase();

    // 0. Update history (simple approximation for local context)
    // Real history management happens in chat.js calling saveConversation, 
    // but we track a bit here for context-awareness in this session

    // 1. ADVANCED KNOWLEDGE BASE (Simulated Intelligence)
    const knowledgeBase = {
      "javascript": {
        keywords: ["javascript", "js", "node", "frontend", "react"],
        responses: [
          "JavaScript is a versatile language. For frontend, focus on DOM manipulation and React/Vue. For backend, Node.js is powerful.",
          "In JavaScript, remember that `==` performs type coercion while `===` matches type and value. Always use `===` for safety.",
          "Async/await usually leads to cleaner code than Promises or Callbacks. Try wrapping your async calls in try/catch blocks."
        ]
      },
      "python": {
        keywords: ["python", "pip", "django", "flask", "ml", "ai"],
        responses: [
          "Python is excellent for AI and Data Science due to libraries like PyTorch, TensorFlow, and Pandas.",
          "List comprehensions in Python `[x for x in list]` are often faster and more readable than standard for-loops.",
          "Remember that Python uses indentation for scope, unlike curly braces in C-family languages."
        ]
      },
      "life": {
        keywords: ["meaning of life", "live", "existence"],
        responses: [
          "The meaning of life is what you make of it. Maybe it's to build great code like this!",
          "Philosophy suggests we create our own purpose. What is your purpose in this project?"
        ]
      },
      "nexchat": {
        keywords: ["nexchat", "app", "this project"],
        responses: [
          "NEXCHAT is a PWA (Progressive Web App) built with Firebase. It features real-time chat, encryption, and me, Chronex AI.",
          "This application runs mainly on the client-side for speed, using Firestore for data persistence."
        ]
      }
    };

    // Check Knowledge Base
    for (const [topic, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(k => msg.includes(k))) {
        // Return a random smart response from that topic
        const response = data.responses[Math.floor(Math.random() * data.responses.length)];
        this.lastResponses.push(response);
        return response;
      }
    }

    // 2. Identity / Status
    if (msg.includes("who are you") || msg.includes("what are you")) {
      return "I am Chronex AI v2.0 (Enhanced). I run on a hybrid architecture: primarily a Python Neural Network backend with a local JavaScript failover layer for speed.";
    }

    // 3. Logic & Reasoning (Simulation)
    if (msg.includes("because") || msg.includes("why")) {
      return "That's a valid point. Causal relationships are key to understanding systems. Can you elaborate on the specific cause you're interested in?";
    }

    // 4. Fallback to basic Keyword matching if KB failed
    if (msg.includes("code") || msg.includes("program")) return "I can help with code structures. Please paste a snippet or ask about a specific concept like 'loops' or 'functions'.";
    if (msg.includes("math") || msg.includes("calc")) return "I can attempt math. For complex calculus, please ensure the Python Backend (CHRONEX-AI.py) is running.";

    // 5. Context-aware generic fallback
    if (this.lastResponses.length > 0) {
      // Avoid repeating the exact last thing
      // (Simple check)
    }

    return "I am listening. To unlock my full potential (Smarter than standard AI), please ensure `CHRONEX-AI.py` is running in your terminal. Currently running in Local-Only Mode.";
  }

  // Python backend (ML/advanced processing)
  async getPythonResponse(message) {
    // Fast fail check
    if (!this.config.backends.python.enabled) return this.getJavaScriptResponse(message);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.backends.python.timeout);

      // Prepare context/history
      const context = this.conversationHistory.slice(-5);

      const response = await fetch(this.config.backends.python.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          model: this.config.model.name,
          temperature: this.config.model.temperature,
          history: context,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Python backend error: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.response || data.text;

      // Update local history
      this.conversationHistory.push({ role: 'user', content: message });
      this.conversationHistory.push({ role: 'assistant', content: aiText });

      return aiText;
    } catch (error) {
      console.warn("⚠️ Chronex AI Brain (Python) disconnected. Using Local Fallback.");
      return this.getJavaScriptResponse(message);
    }
  }

  // Cache management
  cacheResponse(key, value) {
    if (this.config.response.caching) {
      this.cache.set(key, {
        value,
        timestamp: Date.now(),
      });

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
        }, { onlyOnce: true });
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
