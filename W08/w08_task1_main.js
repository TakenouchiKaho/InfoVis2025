d3.csv("https://TakenouchiKaho.github.io/InfoVis2025/W08/w08_task1.csv")
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
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0); //Modify

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0); //Modify

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

        self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0) //Modify
            .attr("y", d => self.yscale( d.label ))
            .attr("width", d => self.xscale( d.value ))
            .attr("height", self.yscale.bandwidth());

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}