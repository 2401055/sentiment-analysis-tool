from flask import Flask, render_template, request, jsonify
from textblob import TextBlob

app = Flask(__name__)

@app.route('/')
def index():
    """Renders the main page."""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Handles sentiment analysis requests.
    Expects JSON: {"text": "some text"}
    Returns JSON: {"sentiment": "Positive", "polarity": 0.75}
    """
    data = request.get_json()
    
    if not data or 'text' not in data or not data['text'].strip():
        return jsonify({"error": "Input text is empty"}), 400
    
    text = data['text']
    
    # Perform sentiment analysis using TextBlob
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    
    # Determine sentiment label based on polarity
    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    
    return jsonify({
        "sentiment": sentiment,
        "polarity": round(polarity, 2)
    })

if __name__ == '__main__':
    # Run the app on port 5000
    app.run(debug=True, host='0.0.0.0', port=5000)
