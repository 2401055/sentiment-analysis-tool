document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const currentCharCount = document.getElementById('currentCharCount');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loading = document.getElementById('loading');
    const resultSection = document.getElementById('resultSection');
    const resultCard = document.querySelector('.result-card');
    const sentimentEmoji = document.getElementById('sentimentEmoji');
    const sentimentLabel = document.getElementById('sentimentLabel');
    const polarityScore = document.getElementById('polarityScore');
    const errorMessage = document.getElementById('errorMessage');
    
    let polarityChart = null;

    // Character Counter
    textInput.addEventListener('input', () => {
        const length = textInput.value.length;
        currentCharCount.textContent = length;
    });

    // Analyze Button Click
    analyzeBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        
        if (!text) {
            showError('Please enter some text to analyze.');
            return;
        }

        // Reset UI
        hideError();
        resultSection.classList.add('hidden');
        loading.classList.remove('hidden');

        // Simulate a delay for the "Analyzing..." effect in the static demo
        setTimeout(() => {
            try {
                // In a real app, this would be a fetch to the Flask backend.
                // For the GitHub Pages static demo, we use a simple client-side logic.
                const result = analyzeSentimentLocally(text);
                displayResult(result);
            } catch (error) {
                showError('An error occurred during analysis.');
                console.error('Error:', error);
            } finally {
                loading.classList.add('hidden');
            }
        }, 800);
    });

    /**
     * Simple client-side sentiment analysis for the static demo.
     * Note: The real app uses TextBlob in the Flask backend.
     */
    function analyzeSentimentLocally(text) {
        const positiveWords = ['love', 'good', 'great', 'awesome', 'amazing', 'happy', 'excellent', 'wonderful', 'best'];
        const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'worst', 'sad', 'angry', 'poor', 'disappointing'];
        
        const words = text.toLowerCase().match(/\w+/g) || [];
        let score = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) score += 0.4;
            if (negativeWords.includes(word)) score -= 0.4;
        });

        // Clamp score between -1 and 1
        const polarity = Math.max(-1, Math.min(1, score));
        
        let sentiment = 'Neutral';
        if (polarity > 0) sentiment = 'Positive';
        else if (polarity < 0) sentiment = 'Negative';

        return { sentiment, polarity: parseFloat(polarity.toFixed(2)) };
    }

    function displayResult(data) {
        const { sentiment, polarity } = data;
        
        sentimentLabel.textContent = sentiment;
        polarityScore.textContent = polarity;

        resultCard.className = 'result-card';
        if (sentiment === 'Positive') {
            sentimentEmoji.textContent = '😊';
            resultCard.classList.add('positive');
        } else if (sentiment === 'Negative') {
            sentimentEmoji.textContent = '😡';
            resultCard.classList.add('negative');
        } else {
            sentimentEmoji.textContent = '😐';
            resultCard.classList.add('neutral');
        }

        resultSection.classList.remove('hidden');
        updateChart(polarity);
    }

    function updateChart(polarity) {
        const ctx = document.getElementById('polarityChart').getContext('2d');
        if (polarityChart) polarityChart.destroy();

        polarityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Polarity'],
                datasets: [{
                    label: 'Sentiment Score (-1 to 1)',
                    data: [polarity],
                    backgroundColor: polarity > 0 ? '#2ecc71' : (polarity < 0 ? '#e74c3c' : '#95a5a6'),
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: { min: -1, max: 1, grid: { color: 'rgba(0,0,0,0.1)' } }
                },
                plugins: { legend: { display: false } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }
});
