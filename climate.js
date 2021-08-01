
var data;

var Country = 'World';
var Year = '2018'

var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");  



var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")


var mouseover = function(d) {
        tooltip
        .style("opacity", 1)
    }



// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseleave = function(d) {
    tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
}


async function loadData() {

    data = await d3.csv('CO2_Forest_Data.csv');
}

loadData().then(() => {

    co2ForestScene()

})


function co2ForestScene() {

    var x = d3.scaleLog().domain([0,34041046]).range([ 0, width ]).base(10)
    var y = d3.scaleLog().domain([0,20055411]).range([ height, 0]).base(10)

    //Country_filter = _.where(data, {"Country Name": Country});

    CO2_filter = _.where(data, {"Series Name": "CO2 emissions (kt)"});
    Forest_filter = _.where(data, {"Series Name": "Forest area (sq. km)"});

    C02_array = _.pluck(CO2_filter, Year);
    Forest_array = _.pluck(Forest_filter, Year);
    CountryName_array = _.pluck(CO2_filter, 'Country Name');


    var co2Forest = []
    for (let index = 0; index < CountryName_array.length; index++) {
        co2Forest.push({'Country': CountryName_array[index], 'CO2': C02_array[index], 'Forest': Forest_array[index]})
        
    }

    console.log(co2Forest)

    var mousemove = function(d) {
        tooltip
        .html("Region: " + d.Country)
        .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.mouse(this)[1]) + "px")
    }


    svg.append('g')
    .attr("transform","translate("+50+","+50+")")
    .selectAll('dot')
    .data(co2Forest)
    .enter()
    .append('circle')
    .attr('cx', function(d,i){
        if(d.Forest != '..'){
            return x(d.Forest)
        } else{
            return 0;
        }
        
    })
    .attr('cy', function(d,i){ 
        
        if(d.CO2 != '..'){
            return y(d.CO2)
        } else{
            return 0;
        }
    }).attr('r', function(d,i){ 
        
        if(d.CO2 == '..' || d.Forest == '..'){
            console.log(d.Country) 
            return 0

        } else{
            return 7;
        }
    }).style("fill", "#69b3a2")
    .style("opacity", 0.3)
    .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )


    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    svg.append("g")
    .call(d3.axisLeft(y));

}






