d3.csv("https://TakenouchiKaho.github.io/InfoVis2025/W08/data.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.value = +d.width || +d.x; });
        
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:10, right:10, bottom:20, left:60} };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {
        
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || {top:10, right:10, bottom:20, left:60}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .append('svg')
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform',
                `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        // Initialize axis scales
        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleBand()
            .range( [0, self.inner_height] )
            .paddingInner(0.1); //add

        // Initialize axes
        self.xaxis = d3.axisBottom( self.xscale );

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)

        self.yaxis = d3.axisLeft( self.yscale );

        self.yaxis_group = self.chart.append('g');
    }

    update() {
        let self = this;

        const xmax = d3.max( self.data, d => d.value );
        self.xscale.domain( [0, xmax] );

        self.yscale.domain( self.data.map(d => d.label) );

        self.render();
    }

    render() {
        let self = this;
        let padding = 10;
        let height = 20;
        
        svg.chart.selectAll("rect")
            .data(self.data)
            .join("rect")
            .transition().duration(1000)
            .attr("x", padding)
            .attr("y", (d,i) => padding + i * (height + padding ))
            .attr("width", d => self.xscale( d.value ))
            .attr("height", self.yscale.bandwidth());

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}

d3.select('#reverse')
    .on('click', d => {
        data.reverse();
        bar_chart.reverse();
    });

d3.select('#ascend')
    .on('click', d => {
        data.reverse();
        bar_chart.sort(ascend);
    });

d3.select('#descend')
    .on('click', d => {
        data.reverse();
        bar_chart.sort(descend);
    });