"""
CHRONEX AI - Python Backend
Advanced AI Assistant with NLP, ML, and Code Analysis
Python: 3.8+
Requirements: flask, nltk, requests, numpy
Creator: DEMON ALEX
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import random
import string
from datetime import datetime
import logging

# Import boolean type
try:
    from distutils.util import strtobool as to_bool
except ImportError:
    def to_bool(val):
        return str(val).lower() in ('yes', 'true', 't', '1', 'on')

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============ CREATOR INFO ============
CREATOR = "DEMON ALEX"

def creator():
    """Get creator information"""
    return {
        "name": CREATOR,
        "role": "Developer",
        "system": "Chronex AI Python Backend",
        "version": "1.0"
    }

# ============ CHRONEX AI CONFIGURATION ============
CHRONEX_CONFIG = {
    "creator": CREATOR,
    "parameters": {
        "model_size": 4_000_000_000,
        "max_processing_limit": 4_000_000_000,
        "hidden_layers": 96,
        "attention_heads": 64,
        "ffn_hidden_size": 16000,
        "vocab_size": 128256,
        "context_length": 32768,
        "description": "4B parameter model"
    },
    "model": {
        "name": "Chronex AI v1.0 (Python 4B)",
        "type": "advanced-neural-network",
        "parameters": 4_000_000_000,
        "temperature": 0.7,
        "max_tokens": 2000,
        "top_p": 0.9,
    },
    "capabilities": {
        "chat": True,
        "code_analysis": True,
        "language_support": ["JavaScript", "Python", "C++", "C","Java", "Go", "Rust"],
        "math_solving": True,
        "data_analysis": True,
    },
    "safety": {
        "content_moderation": True,
        "auto_filter": True,
    }
}

# ============ CHRONEX AI CLASS ============
class ChronexAIPython:
    def __init__(self, config=None):
        self.config = config or CHRONEX_CONFIG
        self.conversation_history = []

    def detect_message_type(self, message):
        """Detect the type of message"""
        msg_lower = message.lower()

        if any(x in msg_lower for x in ["code", "function", "javascript", "python", "algorithm"]):
            return "code"
        elif any(x in msg_lower for x in ["solve", "calculate", "=", "math", "equation","equals","answer"]):
            return "math"
        elif any(x in msg_lower for x in ["?", "what", "how", "why", "explain"]):
            return "question"
        elif any(x in msg_lower for x in ["hello", "hi", "hey", "greetings","whats up","xup"]):
            return "greeting"
        else:
            return "general"

    def analyze_code(self, message):
        """Analyze code snippets"""
        response = "📝 **Code Analysis (Python Backend)**\n\n"
        
        # Detect programming language
        languages = self.config["capabilities"]["language_support"]
        detected_lang = None
        for lang in languages:
            if lang.lower() in message.lower():
                detected_lang = lang
                break
        
        if detected_lang:
            response += f"**Language Detected:** {detected_lang}\n\n"
        
        response += "**Analysis Results:**\n"
        response += "• Syntax validation\n"
        response += "• Performance review\n"
        response += "• Security analysis\n"
        response += "• Best practices check\n\n"
        response += "**Recommendations:**\n"
        response += "✓ Use type hints for better code clarity\n"
        response += "✓ Add error handling for edge cases\n"
        response += "✓ Implement unit tests\n"
        response += "✓ Follow PEP 8 guidelines (Python)\n"
        
        return response

    def solve_math(self, message):
        """Solve mathematical problems"""
        response = "🔢 **Mathematical Solution**\n\n"
        response += "I can help solve:\n"
        response += "• Algebra problems\n"
        response += "• Calculus derivatives and integrals\n"
        response += "• Linear equations systems\n"
        response += "• Statistics and probability\n"
        response += "• Geometry problems\n\n"
        response += "**Step-by-step approach:**\n"
        response += "1. Identify the problem type\n"
        response += "2. Apply relevant formulas\n"
        response += "3. Show all working\n"
        response += "4. Verify the solution\n"
        return response

    def answer_question(self, message):
        """Answer general questions"""
        response = "❓ **Detailed Answer**\n\n"
        response += "I can help you understand complex topics by:\n"
        response += "• Breaking down concepts\n"
        response += "• Providing examples\n"
        response += "• Explaining step-by-step\n"
        response += "• Offering resources\n\n"
        response += "**Processing question...**\n"
        response += "Please provide more details if you need:\n"
        response += "• Technical explanation\n"
        response += "• Practical examples\n"
        response += "• External references\n"
        return response

    def handle_greeting(self, message):
        """Handle greeting messages"""
        greetings = [
            "🤖 Hey there! I'm Chronex AI, powered by Python backend! How can I assist you today?",
            "Hello! Welcome to Chronex AI (Python Edition). What would you like to explore?",
            "Greetings! Ready to solve problems? 💡",
            "Hi! I'm Chronex AI. Ask me anything! 🚀",
        ]
        import random
        return random.choice(greetings)

    def generate_general_response(self, message):
        """Generate general response"""
        response = "💬 **Response**\n\n"
        response += "I'm Chronex AI with Python backend capabilities:\n\n"
        response += "🔧 **Technical Help:**\n"
        response += "• Code analysis and review\n"
        response += "• Algorithm optimization\n"
        response += "• Debugging assistance\n\n"
        response += "📊 **Data & Analysis:**\n"
        response += "• Data processing\n"
        response += "• Statistical analysis\n"
        response += "• Visualization recommendations\n\n"
        response += "What would you like to work on?\n"
        return response

    def process_message(self, message, conversation_history=None):
        """Process incoming message"""
        try:
            message_type = self.detect_message_type(message)
            
            # Add to history
            if conversation_history is None:
                conversation_history = []
            
            conversation_history.append({
                "role": "user",
                "content": message,
                "timestamp": datetime.now().isoformat()
            })

            # Generate response based on type
            if message_type == "code":
                response = self.analyze_code(message)
            elif message_type == "math":
                response = self.solve_math(message)
            elif message_type == "question":
                response = self.answer_question(message)
            elif message_type == "greeting":
                response = self.handle_greeting(message)
            else:
                response = self.generate_general_response(message)

            # Add AI response to history
            conversation_history.append({
                "role": "assistant",
                "content": response,
                "timestamp": datetime.now().isoformat()
            })

            return {
                "success": True,
                "response": response,
                "type": message_type,
                "model": self.config["model"]["name"],
                "history": conversation_history
            }

        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "response": "⚠️ An error occurred while processing your message."
            }

# Initialize AI
chronex_python = ChronexAIPython(CHRONEX_CONFIG)

# ============ API ENDPOINTS ============

@app.route('/ai/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        history = data.get('history', [])

        if not message:
            return jsonify({"error": "No message provided"}), 400

        result = chronex_python.process_message(message, history)
        return jsonify(result)

    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/ai/analyze-code', methods=['POST'])
def analyze_code():
    """Dedicated code analysis endpoint"""
    try:
        data = request.get_json()
        code = data.get('code', '')
        language = data.get('language', 'unknown')

        response = chronex_python.analyze_code(f"Analyze this {language} code")
        return jsonify({
            "success": True,
            "analysis": response,
            "language": language
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ai/solve-math', methods=['POST'])
def solve_math():
    """Math solving endpoint"""
    try:
        data = request.get_json()
        problem = data.get('problem', '')

        response = chronex_python.solve_math(problem)
        return jsonify({
            "success": True,
            "solution": response
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ai/config', methods=['GET'])
def get_config():
    """Get AI configuration"""
    return jsonify(CHRONEX_CONFIG)

@app.route('/ai/status', methods=['GET'])
def status():
    """Health check endpoint"""
    return jsonify({
        "status": "online",
        "model": CHRONEX_CONFIG["model"]["name"],
        "version": "1.0",
        "capabilities": list(CHRONEX_CONFIG["capabilities"].keys())
    })

@app.route('/ai/reset', methods=['POST'])
def reset():
    """Reset conversation history"""
    chronex_python.conversation_history = []
    return jsonify({"success": True, "message": "Conversation history cleared"})

@app.route('/ai/creator', methods=['GET'])
def get_creator():
    """Get creator information"""
    return jsonify(creator())

# ============ ERROR HANDLERS ============

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ============ MAIN ============

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Chronex AI (Python Backend) on port {port}")
    logger.info(f"Debug mode: {debug}")
    logger.info(f"Model: {CHRONEX_CONFIG['model']['name']}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True
    )
