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

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            const data = await response.json();

            if (response.ok) {
                displayResult(data);
            } else {
                showError(data.error || 'An error occurred on the server.');
            }
        } catch (error) {
            showError('Failed to connect to the server.');
            console.error('Error:', error);
        } finally {
            loading.classList.add('hidden');
        }
    });

    function displayResult(data) {
        const { sentiment, polarity } = data;
        
        // Set Label and Score
        sentimentLabel.textContent = sentiment;
        polarityScore.textContent = polarity;

        // Set Emoji and Colors
        resultCard.className = 'result-card'; // Reset classes
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

        // Show Section
        resultSection.classList.remove('hidden');

        // Update Chart
        updateChart(polarity);
    }

    function updateChart(polarity) {
        const ctx = document.getElementById('polarityChart').getContext('2d');
        
        if (polarityChart) {
            polarityChart.destroy();
        }

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
                    x: {
                        min: -1,
                        max: 1,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
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
