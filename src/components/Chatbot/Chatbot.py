#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  DeepSeek
#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  Mistral Instruct
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

# Create Flask app instance
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for React frontend communication
CORS(app)

# Function to send request to Deepseek API
def get_chatbot_response(user_input):
    # Set up the request data with dynamic user input
    data = {
        #"model": "deepseek/deepseek-r1:free",
        "model": "mistralai/mixtral-8x7b-instruct",
        "messages": [
            {
                "role": "user",
                "content": user_input
            }
        ]
    }

    # Define the headers
    headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "<YOUR_SITE_URL>",  # Optional
        "X-Title": "<YOUR_SITE_NAME>"  # Optional
    }

    # Send the request
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            data=json.dumps(data),
            timeout=60
        )

        #print("Response from API:", response.text)  # Print the raw response from the API
         
        if response.status_code == 200:
            response_json = response.json()
            # Check if the expected response is in the right format
            if "choices" in response_json and len(response_json["choices"]) > 0:
                return response_json.get("choices")[0].get("message").get("content")
            else:
                return "Sorry, I couldn't get a response. Please try again later."
        else:
            return f"Error: Request failed with status code {response.status_code}.\nResponse content: {response.text}"

    except Exception as e:
        return f"Error occurred: {e}"
    
    # Route to handle chatbot requests
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')  # Get the message from the frontend
    if user_input:
        response = get_chatbot_response(user_input)  # Get the chatbot response
        return jsonify({"response": response})  # Return the response as JSON
    return jsonify({"response": "No message received."})

if __name__ == '__main__':
    app.run(debug=True)

# Main loop to interact with the user
'''def chatbot_interaction():
    print("Welcome to the Deepseek chatbot! Type 'exit' to end the conversation.")

    while True:
        user_input = input("You: ")  # Take input from the user
        if user_input.lower() == "exit":
            print("Goodbye! Have a great day!")
            break

        # Get the chatbot's response to the user's input
        chatbot_reply = get_chatbot_response(user_input)

        # Display the chatbot's response
        print("Chatbot: " + chatbot_reply)

# Start the chatbot interaction
chatbot_interaction()
'''

