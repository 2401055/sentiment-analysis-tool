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
    let debounceTimer;

    // Hide the button as it's now real-time
    if (analyzeBtn) {
        analyzeBtn.style.display = 'none';
    }

    // Real-time Input Listener
    textInput.addEventListener('input', () => {
        const text = textInput.value.trim();
        const length = text.length;
        currentCharCount.textContent = length;

        clearTimeout(debounceTimer);

        if (!text) {
            hideError();
            resultSection.classList.add('hidden');
            loading.classList.add('hidden');
            return;
        }

        debounceTimer = setTimeout(() => {
            performAnalysisLocally(text);
        }, 500);
    });

    function performAnalysisLocally(text) {
        hideError();
        loading.classList.remove('hidden');

        // Simulate processing delay
        setTimeout(() => {
            const result = analyzeSentimentLocally(text);
            displayResult(result);
            loading.classList.add('hidden');
        }, 300);
    }

    function analyzeSentimentLocally(text) {
        const positiveWords = ['love', 'good', 'great', 'awesome', 'amazing', 'happy', 'excellent', 'wonderful', 'best', 'cool', 'nice'];
        const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'worst', 'sad', 'angry', 'poor', 'disappointing', 'horrible', 'ugly'];
        
        const words = text.toLowerCase().match(/\w+/g) || [];
        let score = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) score += 0.4;
            if (negativeWords.includes(word)) score -= 0.4;
        });

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
