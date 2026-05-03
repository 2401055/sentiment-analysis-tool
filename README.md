# Sentiment Analysis Tool

A full-stack web application that analyzes the sentiment of text using Python (Flask) and TextBlob.

## Features
- **Real-time Analysis**: Get sentiment results (Positive, Negative, Neutral) instantly.
- **Visual Feedback**: Dynamic emoji and color changes based on sentiment.
- **Data Visualization**: Bar chart showing the polarity score using Chart.js.
- **Responsive Design**: Works on desktop and mobile devices.
- **Character Counter**: Helps track input length.

## Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Fetch API)
- **Backend**: Python, Flask
- **Analysis Library**: TextBlob
- **Visualization**: Chart.js

## How to Run Locally

1. **Clone the repository** (or download the files).
2. **Install dependencies**:
   ```bash
   pip install flask textblob
   ```
3. **Run the application**:
   ```bash
   python app.py
   ```
4. **Access the tool**:
   Open your browser and go to `http://localhost:5000`.

## Project Structure
- `app.py`: Flask backend and sentiment logic.
- `templates/index.html`: Main frontend structure.
- `static/style.css`: Custom styling and animations.
- `static/script.js`: Frontend logic and API communication.
- `gh-pages/`: Static demo version for GitHub Pages.

## Deployment
This project is ready for deployment on platforms like **Render**, **Railway**, or **Heroku**. For a static demo, the `gh-pages` folder can be hosted directly on GitHub Pages.
