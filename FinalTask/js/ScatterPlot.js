class ScatterPlot {
    constructor(config, data) {
        this.config = {
            parentElement: config.parentElement,
            width: config.width || 600,
            height: config.height || 600,
            margin: config.margin || { top: 20, right: 20, bottom: 50, left: 50 }
        };
        this.data = data;
        this.displayData = data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.width - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.height - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.width)
            .attr('height', vis.config.height + 60); // Extra space for legend

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([vis.height, 0]);

        vis.colorScale = d3.scaleSequential()
            .domain([0, 80])
            .interpolator(d3.interpolateViridis);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(10)
            .tickSize(-vis.height)
            .tickPadding(10);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(10)
            .tickSize(-vis.width)
            .tickPadding(10);

        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis grid')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis grid');

        vis.chart.append('text')
            .attr('class', 'axis-label')
            .attr('x', vis.width / 2)
            .attr('y', vis.height + 40)
            .attr('text-anchor', 'middle')
            .text('Valence (Happiness)');

        vis.chart.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -vis.height / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .text('Energy');

        vis.brush = d3.brush()
            .extent([[0, 0], [vis.width, vis.height]])
            .on('brush end', (event) => vis.brushed(event));

        vis.brushGroup = vis.chart.append('g')
            .attr('class', 'brush');

        vis.drawLegend();
        vis.updateVis();
    }

    drawLegend() {
        let vis = this;
        const legendWidth = 300;
        const legendHeight = 15;

        const legend = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left + (vis.width - legendWidth) / 2}, ${vis.height + vis.config.margin.top + 60})`);

        const defs = vis.svg.append('defs');
        const linearGradient = defs.append('linearGradient')
            .attr('id', 'pop-gradient');

        linearGradient.selectAll('stop')
            .data(vis.colorScale.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: vis.colorScale(t) })))
            .enter().append('stop')
            .attr('offset', d => d.offset)
            .attr('stop-color', d => d.color);

        legend.append('rect')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#pop-gradient)');

        const legendScale = d3.scaleLinear()
            .domain([0, 80])
            .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
            .ticks(5)
            .tickSize(0)
            .tickPadding(5);

        legend.append('g')
            .attr('transform', `translate(0, ${legendHeight})`)
            .call(legendAxis)
            .select('.domain').remove();

        legend.append('text')
            .attr('x', legendWidth / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#64748b')
            .text('Popularity');
    }

    updateVis() {
        let vis = this;

        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);

        vis.circles = vis.chart.selectAll('.dot')
            .data(vis.displayData, d => d.id)
            .join('circle')
            .attr('class', 'dot')
            .attr('cx', d => vis.xScale(d.valence))
            .attr('cy', d => vis.yScale(d.energy))
            .attr('r', 4)
            .attr('fill', d => vis.colorScale(d.popularity))
            .on('mouseover', function (event, d) {
                d3.select(this).classed('highlight', true);
                d3.select('#tooltip')
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px')
                    .classed('hidden', false);
                d3.select('#song-name').text(d.name);
                d3.select('#artist-name').text(`Artists: ${d.artists.replace(/[\[\]"]/g, '')}`);
                d3.select('#song-popularity').text(`Popularity: ${d.popularity}`);
            })
            .on('mouseout', function () {
                d3.select(this).classed('highlight', false);
                d3.select('#tooltip').classed('hidden', true);
            });

        vis.brushGroup.call(vis.brush);
    }

    brushed(event) {
        let vis = this;
        let selection = event.selection;

        if (selection) {
            const [[x0, y0], [x1, y1]] = selection;
            const selectedData = vis.displayData.filter(d => (
                vis.xScale(d.valence) >= x0 && vis.xScale(d.valence) <= x1 &&
                vis.yScale(d.energy) >= y0 && vis.yScale(d.energy) <= y1
            ));
            vis.onSelectionChange(selectedData);
        } else {
            vis.onSelectionChange(vis.displayData);
        }
    }

    onSelectionChange(selectedData) {
        // Placeholder
    }
}
