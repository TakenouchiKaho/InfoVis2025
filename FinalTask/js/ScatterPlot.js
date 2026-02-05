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
            .attr('height', vis.config.height + 100); // Increased extra space for legend

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

        // Add crosshairs (extension)
        vis.crosshairX = vis.chart.append('line')
            .attr('class', 'crosshair')
            .attr('y1', 0)
            .attr('y2', vis.height)
            .style('display', 'none');

        vis.crosshairY = vis.chart.append('line')
            .attr('class', 'crosshair')
            .attr('x1', 0)
            .attr('x2', vis.width)
            .style('display', 'none');

        vis.drawLegend();
        vis.updateVis();
    }

    drawLegend() {
        let vis = this;
        const legendWidth = 300;
        const legendHeight = 15;

        const legend = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left + (vis.width - legendWidth) / 2}, ${vis.height + vis.config.margin.top + 90})`);

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
            .style('cursor', 'pointer')
            .attr('cx', d => vis.xScale(d.valence))
            .attr('cy', d => vis.yScale(d.energy))
            .attr('r', 4)
            .attr('fill', d => vis.colorScale(d.popularity))
            .on('mouseover', function (event, d) {
                d3.select(this).classed('highlight', true);

                // Show crosshairs
                vis.crosshairX.style('display', null).attr('x1', vis.xScale(d.valence)).attr('x2', vis.xScale(d.valence));
                vis.crosshairY.style('display', null).attr('y1', vis.yScale(d.energy)).attr('y2', vis.yScale(d.energy));

                d3.select('#tooltip')
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px')
                    .classed('hidden', false);

                d3.select('#song-name').text(d.name);
                d3.select('#artist-name').text(`Artists: ${d.artists.replace(/[\[\]"]/g, '')}`);
                d3.select('#song-popularity').text(`Popularity: ${d.popularity}`);

                d3.select('#spotify-link').html('<div style="font-size:0.75rem; color:var(--text-secondary); opacity:0.8;">(Click dot for live details)</div>');
            })
            .on('click', function (event, d) {
                vis.onSingleClick(d);
            })
            .on('mouseout', function () {
                d3.select(this).classed('highlight', false);
                vis.crosshairX.style('display', 'none');
                vis.crosshairY.style('display', 'none');
                // Tooltip stays until next mouseover or if we want it to hide
                // For links to work, we might want to keep it or use a delay.
                // But simple hide is standard if it's not interactive.
                // To make it interactive, we'd need to remove pointer-events:none.
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

    resizeVis() {
        let vis = this;
        vis.width = vis.config.width - vis.config.margin.left - vis.config.margin.right;
        vis.svg.attr('width', vis.config.width);
        vis.xScale.range([0, vis.width]);
        vis.xAxis.tickSize(-vis.height);
        vis.yAxis.tickSize(-vis.width);
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
        vis.updateVis();
    }

    onSingleClick(d) {
        // Placeholder
    }

    onSelectionChange(selectedData) {
        // Placeholder
    }
}
