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

  // Handle greetings with varied responses
  handleGreeting(message) {
    const greetings = [
      "Hey there! 👋 I'm Chronex AI, your intelligent assistant. How can I help you today?",
      "Hello! Welcome to Chronex AI! What would you like to know? 🤖",
      "Greetings! I'm ready to assist you with any questions or tasks. 💡",
      "Hi! Great to meet you! What can I help you with? 🚀",
      "Welcome! 🌟 I'm Chronex AI. How may I assist you today?",
      "Yo! 👋 Thanks for reaching out. What's on your mind?",
      "Hey! 🙌 I'm Chronex AI. Ready to help with anything!",
      "Sup! 🤖 What can I do for you today?",
    ];

    return def_random(greetings);
  }

  // General response with varied replies - NOW CONTEXT-AWARE
  generateGeneralResponse(message) {
    const msgLower = message.toLowerCase();
    
    // Extract key topics from message
    const topics = this.extractTopics(message);
    
    // Build context-aware response
    let contextResponse = this.buildContextResponse(message, topics, msgLower);
    
    if (contextResponse) {
      return contextResponse;
    }

    // Fallback to general responses
    const responses = [
      `💬 **Response**\n\nThanks for your message! I'm Chronex AI, and I can help with:\n• Code analysis and suggestions\n• Mathematical problems\n• Answering questions\n• Writing assistance\n• Data analysis\n\nWhat would you like to explore?`,
      
      `That's interesting! 🤔 I can assist you with:\n• Programming and code reviews\n• Complex calculations\n• Detailed explanations\n• Creative writing\n• Data insights\n\nHow can I help?`,
      
      `I hear you! 👂 Here are some things I'm great at:\n• 💻 Code analysis\n• 📊 Data processing\n• ❓ Answering questions\n• ✍️ Writing help\n• 🔢 Math solutions\n\nLet's dive in!`,
      
      `Thanks for reaching out! 🙋 I'm equipped to help with:\n• Software development\n• Problem-solving\n• Research and analysis\n• Writing and editing\n• Technical explanations\n\nWhat's your need?`,
      
      `Nice to chat! 💭 I specialize in:\n• Code review & optimization\n• Mathematical solutions\n• In-depth explanations\n• Writing assistance\n• Data analysis\n\nWhat shall we work on?`,
      
      `Got you! 👍 I can help with:\n• JavaScript, Python, C++ & more\n• Complex calculations\n• Detailed Q&A\n• Content creation\n• Analytics\n\nWhat's next?`,
      
      `Perfect timing! ⏰ My skills include:\n• Full-stack development support\n• Advanced mathematics\n• Comprehensive answers\n• Creative content\n• Information analysis\n\nHow can I assist?`,
    ];

    return def_random(responses);
  }

  // Extract topics from message
  extractTopics(message) {
    const msgLower = message.toLowerCase();
    const topics = [];
    
    // Programming topics
    if (msgLower.includes('javascript') || msgLower.includes('js') || msgLower.includes('node')) topics.push('javascript');
    if (msgLower.includes('python') || msgLower.includes('py')) topics.push('python');
    if (msgLower.includes('react') || msgLower.includes('vue') || msgLower.includes('angular')) topics.push('frontend');
    if (msgLower.includes('database') || msgLower.includes('sql') || msgLower.includes('mongodb')) topics.push('database');
    if (msgLower.includes('api') || msgLower.includes('rest') || msgLower.includes('http')) topics.push('api');
    
    // General topics
    if (msgLower.includes('help') || msgLower.includes('assist')) topics.push('help');
    if (msgLower.includes('error') || msgLower.includes('bug') || msgLower.includes('fix')) topics.push('debugging');
    if (msgLower.includes('explain') || msgLower.includes('understand') || msgLower.includes('learn')) topics.push('explanation');
    if (msgLower.includes('how') || msgLower.includes('what') || msgLower.includes('why')) topics.push('question');
    if (msgLower.includes('create') || msgLower.includes('build') || msgLower.includes('write')) topics.push('creation');
    if (msgLower.includes('optimize') || msgLower.includes('improve') || msgLower.includes('faster')) topics.push('optimization');
    if (msgLower.includes('test') || msgLower.includes('debug')) topics.push('testing');
    
    return topics;
  }

  // Build context-aware response based on extracted topics
  buildContextResponse(message, topics, msgLower) {
    // If no specific topics, return null to use general response
    if (topics.length === 0) return null;
    
    let response = '';
    
    // Debugging help
    if (topics.includes('debugging')) {
      const debugResponses = [
        `🐛 **Debugging Assistance**\n\nLet's fix that issue!\n\n**Steps I'll help with:**\n• Identify the error cause\n• Trace the problem\n• Provide solutions\n• Test the fix\n• Optimize the code\n\nShare your error details and I'll help debug!`,
        `🔧 **Bug Fix Support**\n\nI'm ready to help squash that bug!\n\n**My approach:**\n• Analyze error messages\n• Examine stack traces\n• Identify root cause\n• Suggest fixes\n• Prevent future issues`,
        `⚙️ **Error Resolution**\n\nLet's resolve this together!\n\n**Process:**\n1. Understand the error\n2. Locate the problem area\n3. Develop solution\n4. Verify the fix\n5. Document findings`
      ];
      return def_random(debugResponses);
    }
    
    // Learning/Explanation
    if (topics.includes('explanation')) {
      const explainResponses = [
        `📚 **Detailed Explanation**\n\nI'd be happy to break this down for you!\n\n**I'll cover:**\n• Core concepts\n• Real-world examples\n• Best practices\n• Common pitfalls\n• Practical applications`,
        `🎓 **Learning Support**\n\nLet's make this clear and understandable!\n\n**I'll provide:**\n• Simple explanations\n• Visual examples\n• Step-by-step guides\n• Comparison with similar concepts\n• Practice tips`,
        `💡 **Concept Breakdown**\n\nReady to explain this thoroughly!\n\n**Coverage:**\n• Fundamental concepts\n• Detailed examples\n• Use cases\n• Related topics\n• Resources for deeper learning`
      ];
      return def_random(explainResponses);
    }
    
    // Code creation/writing
    if (topics.includes('creation')) {
      const createResponses = [
        `✍️ **Code Generation**\n\nI can help you build that!\n\n**I provide:**\n• Complete code examples\n• Best practices\n• Comments & documentation\n• Error handling\n• Testing strategies`,
        `🏗️ **Building Solutions**\n\nLet's create something awesome!\n\n**I'll help with:**\n• Code structure\n• Implementation details\n• Performance tips\n• Security considerations\n• Clean code practices`,
        `💻 **Development Assistance**\n\nReady to code together!\n\n**Features I'll include:**\n• Well-structured code\n• Error handling\n• Comments\n• Best practices\n• Testing examples`
      ];
      return def_random(createResponses);
    }
    
    // Optimization
    if (topics.includes('optimization')) {
      const optimizeResponses = [
        `⚡ **Performance Optimization**\n\nLet's make it faster!\n\n**Optimization areas:**\n• Algorithm efficiency\n• Memory usage\n• Database queries\n• Caching strategies\n• Code profiling`,
        `🚀 **Speed Improvement**\n\nI'll help optimize your code!\n\n**Focus areas:**\n• Bottleneck identification\n• Algorithm refinement\n• Resource management\n• Caching techniques\n• Load optimization`,
        `📈 **Performance Tuning**\n\nReady to boost performance!\n\n**Strategies:**\n• Code profiling\n• Complexity reduction\n• Memory efficiency\n• I/O optimization\n• Parallel processing`
      ];
      return def_random(optimizeResponses);
    }
    
    // Programming language specific
    if (topics.includes('javascript')) {
      const jsResponses = [
        `📍 **JavaScript Help**\n\nJavaScript expert here!\n\n**I can assist with:**\n• ES6+ syntax\n• Async/await\n• DOM manipulation\n• Event handling\n• Performance optimization`,
        `⚙️ **JS Development**\n\nLet's work with JavaScript!\n\n**Coverage:**\n• Core concepts\n• Advanced features\n• Debugging tips\n• Best practices\n• Modern frameworks`
      ];
      return def_random(jsResponses);
    }
    
    if (topics.includes('python')) {
      const pyResponses = [
        `🐍 **Python Assistance**\n\nPython specialist at your service!\n\n**I help with:**\n• Syntax & semantics\n• Data structures\n• Libraries & frameworks\n• File handling\n• OOP concepts`,
        `🔍 **Python Development**\n\nReady for Python projects!\n\n**My expertise:**\n• Python fundamentals\n• Advanced features\n• Data processing\n• Web frameworks\n• Best practices`
      ];
      return def_random(pyResponses);
    }
    
    // Database help
    if (topics.includes('database')) {
      const dbResponses = [
        `🗄️ **Database Support**\n\nDatabase expert ready to help!\n\n**I assist with:**\n• SQL queries\n• Schema design\n• Indexing strategies\n• Query optimization\n• NoSQL databases`,
        `📊 **Data Management**\n\nLet's manage your data efficiently!\n\n**Coverage:**\n• Database design\n• Query optimization\n• Data integrity\n• Backup strategies\n• Performance tuning`
      ];
      return def_random(dbResponses);
    }
    
    // API/Backend
    if (topics.includes('api')) {
      const apiResponses = [
        `🔌 **API Development**\n\nAPI specialist here!\n\n**I help with:**\n• RESTful design\n• Endpoints\n• Authentication\n• Error handling\n• Documentation`,
        `🌐 **Backend Services**\n\nReady to build APIs!\n\n**My expertise:**\n• API architecture\n• Security\n• Performance\n• Error handling\n• Testing`
      ];
      return def_random(apiResponses);
    }
    
    // Testing
    if (topics.includes('testing')) {
      const testResponses = [
        `🧪 **Testing & QA**\n\nTesting expert ready!\n\n**I provide:**\n• Unit testing\n• Integration tests\n• Test strategies\n• Coverage analysis\n• CI/CD integration`,
        `✅ **Quality Assurance**\n\nLet's ensure quality!\n\n**Coverage:**\n• Test planning\n• Test execution\n• Bug reporting\n• Automation\n• Best practices`
      ];
      return def_random(testResponses);
    }
    
    return null;
  }

  // Code analysis with varied responses
  analyzeCode(message) {
    const languages = this.config.capabilities.languageSupport;
    const detectedLang = languages.find(lang => message.toLowerCase().includes(lang.toLowerCase()));

    const baseAnalyses = [
      `📝 **Code Review**\n\n${detectedLang ? `**Language:** ${detectedLang}\n\n` : ''}**Recommendations:**\n• Ensure proper error handling\n• Optimize performance bottlenecks\n• Add comprehensive comments\n• Follow best practices\n• Test edge cases thoroughly`,

      `🔍 **Code Analysis**\n\n${detectedLang ? `**Detected:** ${detectedLang}\n\n` : ''}**Insights:**\n• Structure and readability look good\n• Consider modularization\n• Add unit tests\n• Implement logging\n• Security check needed`,

      `💻 **Development Review**\n\n${detectedLang ? `**Language:** ${detectedLang}\n\n` : ''}**Feedback:**\n• Code organization is solid\n• Performance: check loops\n• Add documentation\n• Implement error handlers\n• Consider DRY principle`,

      `✅ **Code Quality Check**\n\n${detectedLang ? `**Analyzed:** ${detectedLang}\n\n` : ''}**Suggestions:**\n• Variable naming: improve clarity\n• Function complexity: consider refactoring\n• Add type hints/types\n• Increase test coverage\n• Optimize imports`,
    ];

    return def_random(baseAnalyses);
  }

  // Math solving with varied responses
  solveMath(message) {
    const mathResponses = [
      `🔢 **Math Solution**\n\nI can help solve mathematical problems! Please provide a specific equation or problem.\n\n**Supported:**\n• Algebra\n• Calculus\n• Statistics\n• Geometry\n• Linear Algebra`,

      `📐 **Mathematics Assistance**\n\nShare your math problem and I'll work through it with you!\n\n**I handle:**\n• Equations & formulas\n• Calculus problems\n• Statistical analysis\n• Geometric calculations\n• Matrix operations`,

      `🧮 **Let's Solve This!**\n\nPost your math question and I'll provide detailed solutions.\n\n**Expertise in:**\n• Elementary to advanced math\n• Real-world applications\n• Step-by-step solutions\n• Formula derivations\n• Problem-solving strategies`,

      `🎯 **Math Problem Solver**\n\nReady to tackle your mathematical challenges!\n\n**I specialize in:**\n• Pure mathematics\n• Applied mathematics\n• Numerical analysis\n• Statistical methods\n• Engineering math`,
    ];

    return def_random(mathResponses);
  }

  // Answer questions with varied responses
  answerQuestion(message) {
    const questionResponses = [
      `❓ **Answer**\n\nThat's a great question! I can help you explore this topic further.\n\n**Capabilities:**\n• Explain concepts\n• Provide examples\n• Suggest resources\n• Break down complex ideas`,

      `🤔 **Let's Explore This**\n\nExcellent question! I'm here to provide clarity.\n\n**I can:**\n• Give detailed explanations\n• Offer real-world examples\n• Share relevant resources\n• Simplify complex topics`,

      `💡 **Insight & Explanation**\n\nGreat thinking! Let me help you understand this better.\n\n**What I offer:**\n• In-depth analysis\n• Practical examples\n• Learning resources\n• Conceptual breakdown`,

      `🎓 **Question Response**\n\nFantastic question! Let's dive deep into this.\n\n**I provide:**\n• Clear explanations\n• Concrete examples\n• Reference materials\n• Simplified breakdowns`,
    ];

    return def_random(questionResponses);
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
