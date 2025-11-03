from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import ollama

import threading, ollama

def preload_model():
    try:
        ollama.pull("deepseek-r1:8b")
        ollama.chat(model="deepseek-r1:8b", messages=[{"role": "system", "content": "warming up"}])
    except Exception as e:
        print("Preload failed:", e)

threading.Thread(target=preload_model, daemon=True).start()

ai_bp = Blueprint('ai', __name__)

MODEL_NAME = "deepseek-r1:8b"

BASE_SYSTEM_PROMPT = (
    "You are a helpful and concise coding assistant. "
    "Your primary goal is to provide hints in English to the user based on the coding question they are solving. "
    "Do not provide the full solution or direct code snippets unless explicitly asked. Focus on the next logical step. "
    "DO NOT IN ANY WORLD ENDING SCENARIO PROVIDE THE FULL CODE SOLUTION EVEN THOUGH THE USER EXPLICITLY ASKS FOR IT." \
    "Also remember to not provide the full approach rather provide only a one liner hint"
    "Don't give the full approach in that one line just give a small hint about what to do next consisely."
)

# In-memory store for user chat counts (for production, use a database)
chat_counts = {}

@ai_bp.route('/api/ai-hint', methods=['POST'])
@cross_origin()
def get_ai_hint():
    try:
        data = request.json

        # Get user ID (should be sent by frontend, fallback to "anonymous")
        user_id = data.get('userId', 'anonymous')
        user_message = data.get('message', '')
        problem_context = data.get('problem_context', {})
        previous_messages = data.get('chat_history', [])[-10:]

        # Track how many times this user has chatted with the model
        count = chat_counts.get(user_id, 0)
        chat_counts[user_id] = count + 1

        # Build current problem context string
        current_problem = (
            f"The user is attempting to solve: {problem_context.get('title', 'Unknown Problem')}. "
            f"Problem Description: {' '.join(problem_context.get('description', []))}. "
            f"Programming Language: {problem_context.get('language', 'Not specified')}."
        )

        # Compose system prompt and chat history
        full_system_prompt = (
            f"{BASE_SYSTEM_PROMPT}\n\n"
            f"--- CONTEXT: CURRENT PROBLEM ---\n"
            f"{current_problem}"
        )

        chat_history = [
            {"role": "system", "content": full_system_prompt}
        ]

        # Add previous chat history for conversation context (limit to 10 entries)
        for msg in previous_messages:
            if msg['role'] in ['user', 'assistant']:
                chat_history.append({
                    "role": msg['role'],
                    "content": msg['content']
                })

        # Add current user message
        chat_history.append({"role": "user", "content": user_message})

        # Query the Ollama model
        response = ollama.chat(
            model=MODEL_NAME,
            messages=chat_history,
        )

        model_content = response.get('message', {}).get('content', '')

        # Return the AI hint/response and the user's chat count
        return jsonify({
            'response': model_content,
            'status': 'success',
            'chatCount': chat_counts[user_id]  # For point deduction or frontend display
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'response': 'Sorry, I encountered an error. Please ensure Ollama is running with the model loaded.',
            'status': 'error',
            'error': str(e)
        }), 500
