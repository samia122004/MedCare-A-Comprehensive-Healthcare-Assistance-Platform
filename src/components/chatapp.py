import openai
from openai import OpenAI

client = OpenAI(api_key="sk-proj-dxXmQhBmD42VSk99WwJIHUdqkXQLFJmaTg7HoNw8sQwzGV2eOBV2jBAQVgPt6LKnGrEUKIGA8rT3" \
"BlbkFJdWBikV6SZxqRfOFzCnapijoj4YjLpVC9qe2zWYVRCW3MQv-bt3Ua-_OtN8iUfScnxKplTLSlIA")

def chat_with_gpt(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

if __name__ == '__main__':
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break
        response = chat_with_gpt(user_input)
        print("Chatbot:", response)
#print(openai.__version__)        
