d3.csv("https://TakenouchiKaho.github.io/InfoVis2025/W08/data.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.value = +d.width || +d.x;  });
        
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class PieChart {
        
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.radius = Math.min( self.config.width, self.config.height ) / 2;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height)

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);;

        self.pie = d3.pie()
            .value( d => d.value);

        self.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(self.radius);
    }

    update() {
        let self = this;

        self.render();
    }

    render() {
        let self = this;

        const pie_data = self.pie(self.data);

        const arcs = self.chart.selectAll(".arc")
            .data(pie_data)
            .join("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", self.arc)
            .attr("fill", 'black')
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        arcs.append("text")
            .attr("transform", d => `translate(${self.arc_label.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "10px")
            .text(d => d.data.label || d.data.key || d.data.value);

    }
}