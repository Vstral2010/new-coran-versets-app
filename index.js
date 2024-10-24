const ratingsData = JSON.parse(localStorage.getItem('ratingsData')) || {};
const lastSubmitTime = localStorage.getItem('lastSubmitTime');

const today = new Date().toISOString().split('T')[0];
document.getElementById('date').value = today;

if (lastSubmitTime && (new Date() - new Date(lastSubmitTime) < 86400000)) {
    document.getElementById('submitBtn').disabled = true;
    alert("Vous devez attendre 24 heures entre les évaluations.");
}

function submitRatings() {
    const date = document.getElementById('date').value;
    const ratings = [];
    
    for (let i = 1; i <= 7; i++) {
        const rating = document.getElementById(`rating${i}`).value;
        if (rating < 1 || rating > 5) {
            alert('Veuillez entrer une évaluation entre 1 et 5 pour chaque verset.');
            return;
        }
        ratings.push(parseInt(rating));
    }

    try {
        ratingsData[date] = ratings;
        localStorage.setItem('ratingsData', JSON.stringify(ratingsData));
        localStorage.setItem('lastSubmitTime', new Date().toISOString());
        alert('Évaluations soumises pour le ' + date);
        for (let i = 1; i <= 7; i++) {
            document.getElementById(`rating${i}`).value = ''; // Clear fields after submission
        }
        updateChart();
    } catch (error) {
        alert('Impossible de sauvegarder vos données. Vérifiez les paramètres de votre navigateur.');
    }
}

function updateChart() {
    const ctx = document.getElementById('myChart').getContext('2d');

    const averages = new Array(7).fill(0);
    const counts = new Array(7).fill(0);

    for (const ratings of Object.values(ratingsData)) {
        for (let i = 0; i < ratings.length; i++) {
            averages[i] += ratings[i];
            counts[i] += (ratings[i] > 0) ? 1 : 0;
        }
    }

    const labels = ['Verset 1', 'Verset 2', 'Verset 3', 'Verset 4', 'Verset 5', 'Verset 6', 'Verset 7'];
    const dataset = averages.map((sum, index) => counts[index] > 0 ? sum / counts[index] : 0);

    if (window.chart) {
        window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Moyenne des Évaluations',
                data: dataset,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    enabled: true
                }
            }
        }
    });
}

updateChart();
