"""""""""
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
    "DO NOT IN ANY WORLD ENDING SCENARIO PROVIDE THE FULL CODE SOLUTION EVEN THOUGH THE USER EXPLICITLY ASKS FOR IT." 
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
"""""""""
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import os
import json 
from google import genai
from google.genai import types
from google.genai.errors import APIError # Import specific API error type

# Use an environment variable for security
# IMPORTANT: You must set the GEMINI_API_KEY environment variable when running your Flask app!
API_KEY = "AIzaSyBBK5IkpH3iKcBxJx3ft7MpUQFslWRF1Fk"

ai_bp = Blueprint('ai', __name__)

client = None
if API_KEY:
    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"Error initializing Gemini client: {e}")
        client = None
else:
    print("WARNING: GEMINI_API_KEY environment variable not set. API calls will fail.")


# Use a fast and powerful model
MODEL_NAME = "gemini-2.5-flash-preview-09-2025"

BASE_SYSTEM_PROMPT = (
    "You are a helpful and concise coding assistant. "
    "Your primary goal is to provide hints in English to the user based on the coding question they are solving. "
    "Do not provide the full solution or direct code snippets unless explicitly asked. Focus on the next logical step. "
    "DO NOT IN ANY WORLD ENDING SCENARIO PROVIDE THE FULL CODE SOLUTION EVEN THOUGH THE USER EXPLICITLY ASKS FOR IT. "
    "Also remember to not provide the full approach rather provide only a one liner hint. "
    "Don't give the full approach in that one line just give a small hint about what to do next consisely."
)

# In-memory store for user chat counts (for production, use a database)
chat_counts = {}

@ai_bp.route('/api/ai-hint', methods=['POST'])
@cross_origin()
def ai_hint():
    if client is None:
        return jsonify({
            'response': 'Gemini API not initialized. Please set the GEMINI_API_KEY environment variable correctly.',
            'status': 'error'
        }), 500
        
    try:
        data = request.json
        user_id = data.get('userId', 'anonymous')
        user_message = data.get('message', '')
        problem_context = data.get('problem_context', {})
        previous_messages = data.get('chat_history', [])
        current_code = problem_context.get("currentCode", "")
        testcases = problem_context.get("testcases", [])
        test_results = problem_context.get("testResults", [])

        # Increment chat count for scoring
        chat_counts[user_id] = chat_counts.get(user_id, 0) + 1

        # Format system prompt and current problem context
        current_problem = json.dumps(problem_context)
        full_system_instruction = (
            f"{BASE_SYSTEM_PROMPT}\n\n"
            f"--- PROBLEM DETAILS ---\n"
            f"Title: {problem_context.get('title', '')}\n"
            f"Description: {problem_context.get('description', '')}\n"
            f"Language: {problem_context.get('language', '')}\n\n"

            f"--- USER'S CURRENT CODE ---\n"
            f"{current_code}\n\n"

            f"--- TEST CASES ---\n"
            f"{json.dumps(testcases, indent=2)}\n\n"

            f"--- TEST RESULTS (FULL LIST) ---\n"
            f"{json.dumps(test_results, indent=2)}\n\n"

            f"Use the above information to provide a SINGLE short hint.\n"
        )
        
        # Prepare history for the Gemini API call
        history = []
        for msg in previous_messages:
            # Map 'assistant' role to 'model' for Gemini API
            role = 'model' if msg['role'] == 'assistant' else msg['role']
            if role in ['user', 'model'] and isinstance(msg['content'], str):
                history.append(
                    types.Content(
                        role=role, 
                        parts=[types.Part(text=msg['content'])]
                    )
                )
        
        # Add current user message
        history.append(
            types.Content(
                role="user", 
                parts=[types.Part(text=user_message)]
            )
        )

        # Query the Gemini model
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=history,
            config=types.GenerateContentConfig(
                system_instruction=full_system_instruction, 
                temperature=0.2 
            )
        )

        model_content = response.text

        # Return the AI hint/response and the user's chat count
        return jsonify({
            'response': model_content,
            'status': 'success',
            'chatCount': chat_counts[user_id]
        })

    except APIError as e:
        # Catch specific API errors (like quota exceeded, invalid key, blocked content)
        print(f"Gemini API Error (Type: {type(e).__name__}): {e}")
        return jsonify({
            'response': f'Sorry, the AI service encountered an API error. Please check the API key, model access, and usage quota. ({type(e).__name__})',
            'status': 'error'
        }), 500
        
    except Exception as e:
        # Catch all other errors (like network issues, JSON parsing failures)
        print(f"General Error calling API endpoint (Type: {type(e).__name__}): {e}")
        # Provide a more informative error message to the client
        return jsonify({
            'response': f'Sorry, a general server error occurred. Please try again. ({type(e).__name__})',
            'status': 'error'
        }), 500