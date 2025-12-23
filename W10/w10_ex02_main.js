var svg = d3.select('#drawing_region');

DrawCircles( [5, 10, 15] );
DrawCircles( [20, 40] );

function DrawCircles( data ) {

    svg.selectAll('circle')
        .data(data)
        .join('circle')
        .attr('fill', 'steelblue')
        .attr('r', d => d)
        .attr('cx', (d, index) => (index * 80) + 50)
        .attr('cy', 80);
}