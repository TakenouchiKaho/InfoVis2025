d3.csv("https://TakenouchiKaho.github.io/InfoVis2025/W04/data.csv")
    .then( data => {
        ShowScatterPlot(data);
    })
    .catch( error => {
        console.log( error );
    });

function ShowScatterPlot(data) {
    var svg = d3.select("body").append("svg");
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r);
};