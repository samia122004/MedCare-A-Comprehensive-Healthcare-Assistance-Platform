from flask import Flask, request, jsonify
from flask_cors import CORS
from Chatbot import get_chatbot_response

app = Flask(__name__)
CORS(app)  # Allow requests from your React app

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({'response': 'Please send a message'}), 400
    
    bot_reply = get_chatbot_response(user_message)
    return jsonify({'response': bot_reply})

if __name__ == '__main__':
    app.run(debug=True)
