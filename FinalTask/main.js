let scatterPlot, barChart, summaryView;
let rawData;

// Load CSV data
d3.csv('japanese_songs_no_lyrics.csv').then(data => {
    // Preprocess data
    data.forEach(d => {
        d.energy = +d.energy;
        d.valence = +d.valence;
        d.popularity = +d.popularity;
    });
    rawData = data;

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

    // Define interaction: Clicking on a dot shows details
    scatterPlot.onSingleClick = (d) => {
        summaryView.showTrackDetails(d);
    };

    // Global helper for SummaryView list items
    window.triggerSingleSelect = (id) => {
        const track = rawData.find(d => d.id === id);
        if (track) summaryView.showTrackDetails(track);
    };

    // Popularity Filter Interaction
    d3.select('#popularity-filter').on('input', function () {
        const minPop = +this.value;
        d3.select('#pop-value').text(minPop);

        // Filter data
        const filteredData = rawData.filter(d => d.popularity >= minPop);

        // Update Scatter Plot
        scatterPlot.displayData = filteredData;
        scatterPlot.updateVis();

        // Reset selection when filtering
        barChart.updateVis(filteredData);
        summaryView.updateVis(filteredData);
    });

    console.log('Data loaded and visualization initialized.');
}).catch(error => {
    console.error('Error loading the CSV data:', error);
});

// Resize handler
window.addEventListener('resize', () => {
    if (scatterPlot) {
        scatterPlot.config.width = document.querySelector('#scatter-card').clientWidth - 60;
        scatterPlot.resizeVis();
    }
    if (barChart) {
        barChart.config.width = document.querySelector('#genre-card').clientWidth - 60;
        barChart.resizeVis();
    }
});
