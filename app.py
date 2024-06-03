from flask import Flask, request, jsonify
from g4f.client import Client
from langdetect import detect
import asyncio

# Set the event loop policy for Windows compatibility
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Initialize the client
client = Client()

app = Flask(__name__)

@app.route('/api/gpt-4', methods=['POST'])
def gpt_4():
    user_input = request.json['content']
    input_lang = detect(user_input)
    model = "gpt-3.5-turbo"
    if input_lang == "zh-cn":
        model = "gpt-3.5-turbo-chinese"
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": user_input}],
    )
    return jsonify({"content": response.choices[0].message.content})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=6000)  # Changed to port 6000
