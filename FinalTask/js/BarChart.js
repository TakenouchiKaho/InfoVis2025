class BarChart {
    constructor(config, data) {
        this.config = {
            parentElement: config.parentElement,
            width: config.width || 350,
            height: config.height || 300,
            margin: config.margin || { top: 10, right: 20, bottom: 40, left: 100 }
        };
        this.data = data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.width - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.height - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.width)
            .attr('height', vis.config.height);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.xScale = d3.scaleLinear()
            .range([0, vis.width]);

        vis.yScale = d3.scaleBand()
            .range([0, vis.height])
            .padding(0.2);

        vis.xAxis = d3.axisBottom(vis.xScale).ticks(5);
        vis.yAxis = d3.axisLeft(vis.yScale);

        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis');

        vis.updateVis(vis.data);
    }

    updateVis(data) {
        let vis = this;

        // Process data for bar chart (top 10 genres)
        let genreFreq = {};
        data.forEach(d => {
            // d.niche_genres is a string like "["genre1", "genre2"]"
            let genres = [];
            try {
                genres = JSON.parse(d.niche_genres.replace(/'/g, '"'));
            } catch (e) {
                // FALLBACK if not valid JSON
                genres = d.niche_genres.replace(/[\[\]"]/g, '').split(',').map(s => s.trim());
            }
            genres.forEach(g => {
                if (g && g !== "") genreFreq[g] = (genreFreq[g] || 0) + 1;
            });
        });

        vis.displayData = Object.entries(genreFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        vis.xScale.domain([0, d3.max(vis.displayData, d => d[1]) || 1]);
        vis.yScale.domain(vis.displayData.map(d => d[0]));

        vis.chart.selectAll('.bar')
            .data(vis.displayData)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', d => vis.yScale(d[0]))
            .attr('height', vis.yScale.bandwidth())
            .transition()
            .duration(500)
            .attr('width', d => vis.xScale(d[1]));

        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }

    resizeVis() {
        let vis = this;
        vis.width = vis.config.width - vis.config.margin.left - vis.config.margin.right;
        vis.svg.attr('width', vis.config.width);
        vis.xScale.range([0, vis.width]);
        vis.xAxis.tickSize(0); // Optional: change tick size
        vis.updateVis(vis.displayData || vis.data);
    }
}
