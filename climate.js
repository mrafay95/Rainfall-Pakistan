
var data;

var Country = 'World';
var Year = '2018'

var margin = {top: 10, right: 50, bottom: 100, left: 100},
    width = 1400 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

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
    .style("position", "absolute")


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


var stringToColour = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}


function chartRender(selectedOption) {
    loadData().then(() => {
        
        d3.selectAll('.dot').remove();
        co2ForestScene(selectedOption)

    })
}





function co2ForestScene(selectedOption) {

    Year = selectedOption

    selectedOptionGroup = ['2006', '2007', '2008', '2009','2010','2011','2012','2013', '2014','2015','2016','2017','2018']

    var x = d3.scaleLog().domain([100,10000000]).range([ 0, width ]).base(10)
    var y = d3.scaleLog().domain([100,11000000]).range([ height, 0]).base(10)

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

    // add the options to the button
    d3.select("#selectButton")
    .selectAll('myOptions')
    .data(selectedOptionGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })
    .property("selected", selectedOption);
 

    console.log(co2Forest)

    var mousemove = function(d) {
        tooltip
        .html("Region: " + d.Country + " CO2 emissions (kt): " + d.CO2 + " Forest area (sq. km): " + d.Forest)
        .style("left", (d3.mouse(this)[0] + 120) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.mouse(this)[1] + 180) + "px")
    }


    svg.append('g')
    .selectAll('dot')
    .data(co2Forest)
    .enter()
    .append('circle')
    .attr('cx', function(d,i){
        if((d.Forest != '..') && (d.Forest > 100)){
            return x(d.Forest)
        } else{
            return 0;
        }
        
    })
    .attr('cy', function(d,i){ 
        
        if((d.CO2 != '..') && (d.CO2 > 100)){
            return y(d.CO2)
        } else{
            return 0;
        }
    }).attr('r', function(d,i){ 
        
        if(d.CO2 == '..' || d.Forest == '..' ||  d.Forest < 100 || d.CO2 < 100){
            console.log(d.Country) 
            return 0

        } else{
            return 7;
        }
    }).style("fill", function(d,i) {

        return stringToColour(d.Country);

    })
    .style("opacity", 0.5)
    .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )


    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickValues([100, 1000, 100000, 500000, 1000000, 5000000, 10000000]).tickFormat(d => d3.format('~s')(d)))
    
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Forest area (sq. km)");
    
    
    svg.append("g")
    .call(d3.axisLeft(y).tickValues([100, 1000, 100000, 500000, 100000, 500000, 1000000, 5000000, 10000000]).tickFormat(d => d3.format('~s')(d)))
    

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("CO2 emissions (kt)");




}




d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    chartRender(selectedOption)
})


chartRender(Year)




