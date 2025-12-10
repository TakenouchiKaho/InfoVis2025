d3.csv("https://TakenouchiKaho.github.io/InfoVis2025/W08/w08_task2.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128
        };

        const line_chart = new LineChart( config, data );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class LineChart {
        
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        
        self.config.margin = self.config.margin || {top: 10, right: 10, bottom: 30, left: 60};

        self.svg = d3.select( self.config.parent )
            .append('svg')
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform',
                `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear().range([0, self.inner_width]);
        self.yscale = d3.scaleLinear().range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0); //Modify

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0); //Modify

        self.yaxis_group = self.chart.append('g');

        self.line = d3.line()
            .x( d => self.xscale(d.x) )
            .y( d => self.yscale(d.y) );

        self.path = self.chart.append('path')
            .attr('stroke', 'black')
            .attr('fill', 'none')
            .attr('stroke-width', 2);
    }

    update() {
        let self = this;

        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [0, xmax] );

        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [0, ymax * 1.1] );

        self.render();
    }

    render() {
        let self = this;

        self.path
            .attr('d', self.line(self.data));

        self.xaxis_group.call( self.xaxis );
        self.yaxis_group.call( self.yaxis );
    }
}