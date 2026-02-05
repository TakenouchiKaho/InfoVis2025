let scatterPlot, barChart, summaryView;

// Load CSV data
d3.csv('japanese_songs_no_lyrics.csv').then(data => {
    // Preprocess data
    data.forEach(d => {
        d.energy = +d.energy;
        d.valence = +d.valence;
        d.popularity = +d.popularity;
    });

    // Initialize View 1: Scatter Plot
    scatterPlot = new ScatterPlot({
        parentElement: '#scatter-plot',
        width: document.querySelector('#scatter-card').clientWidth - 60,
        height: 600
    }, data);

    // Initialize View 2: Bar Chart
    barChart = new BarChart({
        parentElement: '#genre-chart',
        width: document.querySelector('#genre-card').clientWidth - 60,
        height: 300
    }, data);

    // Initialize View 3: Summary
    summaryView = new SummaryView({
        parentElement: '#summary-view'
    }, data);

    // Define interaction: Brushing on scatter plot updates other views
    scatterPlot.onSelectionChange = (selectedData) => {
        barChart.updateVis(selectedData);
        summaryView.updateVis(selectedData);
    };

    console.log('Data loaded and visualization initialized.');
}).catch(error => {
    console.error('Error loading the CSV data:', error);
});

// Resize handler
window.addEventListener('resize', () => {
    if (scatterPlot) {
        // Redraw or update if needed, but for simplicity we keep fixed size for now
    }
});
