d3.csv("https://TakenouchiKaho.github.io/InfoVis2025/W04/w04_task1.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:30, right:10, bottom:50, left:50} };

        let scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {
        
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.default_color = 'black';
        this.highlight_color = 'red';
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform',
                `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);

            self.svg.append("text")
            .attr("x", self.config.width / 2)
            .attr("y", self.config.margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Sample Data");

        self.svg.append("text")
            .attr("x", self.config.width / 2)
            .attr("y", self.config.height - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("X label");

        self.svg.append("text")
            .attr('transform', 'rotate(-90)')
            .attr("x", -self.config.height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Y label");
    }

    update() {
        let self = this;

        self.xscale.domain( [0, 200] );
        self.yscale.domain( [0, 100] );

        self.render();
    }

    render() {
        let self = this;

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .join("circle")
            .attr("cx", d => self.xscale( d.x ))
            .attr("cy", d => self.yscale( d.y ))
            .attr("r", d => d.r )
            .attr('fill', self.default_color);

        circles
            .on('mouseover', (e, d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);

                d3.select(e.target)
                    .attr('fill', self.highlight_color);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'py');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);

                d3.select(e.target)
                    .attr('fill', self.default_color);
            });

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}