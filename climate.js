
var data1;
var data2;
var data3;

var chart = 1;

var selectedOptionGroup = ['2006', '2007', '2008', '2009','2010','2011','2012','2013', '2014','2015','2016','2017','2018']

var selectedOption = '2015'

var margin = {top: 10, right: 50, bottom: 100, left: 100},
    width = parseInt(d3.select('#my_dataviz').style('width'), 10) - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");  

// add the options to the button
d3.select("#selectButton")
        .selectAll('myOptions')
        .data(selectedOptionGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; })
        
d3.select("#selectButton").property('value', selectedOption)


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

    data1 = await d3.csv('CO2_Forest_Data.csv');
    data2 = await d3.csv('CO2_GDP_Data.csv');
    data3 = await d3.csv('CO2_Power_Data.csv');

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


function chartRender() {
    loadData().then(() => {
        
        svg.selectAll("circle").remove();
        svg.selectAll("text").remove();
        svg.selectAll("g").remove();

        if(chart == 1){
            co2GDPScene()
        } else if(chart == 2) {
            console.log()
            co2PowerScene()
        } else if(chart == 3) {
            co2ForestScene()
        }

    })
}





function co2ForestScene() {

    selectedOption = d3.select("#selectButton").property('value')

    var x = d3.scaleLog().domain([100,10000000]).range([ 0, width ]).base(10)
    var y = d3.scaleLog().domain([100,11000000]).range([ height, 0]).base(10)

    //Country_filter = _.where(data, {"Country Name": Country});

    CO2_filter = _.where(data1, {"Series Name": "CO2 emissions (kt)"});
    Forest_filter = _.where(data1, {"Series Name": "Forest area (sq. km)"});

    C02_array = _.pluck(CO2_filter, selectedOption);
    Forest_array = _.pluck(Forest_filter, selectedOption);
    CountryName_array = _.pluck(CO2_filter, 'Country Name');


    var co2Forest = []
    for (let index = 0; index < CountryName_array.length; index++) {
        co2Forest.push({'Country': CountryName_array[index], 'CO2': C02_array[index], 'Forest': Forest_array[index]})
        
    }

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

    // Features of the annotation
    const annotations = [
        {
        note: {
            label: "Here is the annotation label",
            title: "Annotation title"
        },
        x: 100,
        y: 100,
        dy: 100,
        dx: 100
        },
        {
        note: {
            label: "Here is the annotation label",
            title: "Annotation title"
        },
        x: 200,
        y: 100,
        dy: 100,
        dx: 100
        }

    ]

    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
    .annotations(annotations)

    svg.append("g")
    .call(makeAnnotations)


}



function co2PowerScene() {

    selectedOption = d3.select("#selectButton").property('value')


    var x = d3.scaleLinear().domain([0,16000]).range([ 0, width ])
    var y = d3.scaleLinear().domain([0,20]).range([ height, 0])

    //Country_filter = _.where(data, {"Country Name": Country});

    CO2_filter = _.where(data3, {"Series Name": "CO2 emissions (metric tons per capita)"});
    Forest_filter = _.where(data3, {"Series Name": "Electric power consumption (kWh per capita)"});

    C02_array = _.pluck(CO2_filter, selectedOption);
    Forest_array = _.pluck(Forest_filter, selectedOption);
    CountryName_array = _.pluck(CO2_filter, 'Country Name');


    var co2Forest = []
    for (let index = 0; index < CountryName_array.length; index++) {
        co2Forest.push({'Country': CountryName_array[index], 'CO2': C02_array[index], 'Power': Forest_array[index]})
        
    }

    var mousemove = function(d) {
        tooltip
        .html("Region: " + d.Country + " CO2 emissions (metric tons per capita): " + d.CO2 + " Electric power consumption (kWh per capita): " + d.Power)
        .style("left", (d3.mouse(this)[0] + 120) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.mouse(this)[1] + 180) + "px")
    }

    svg.append('g')
    .selectAll('dot')
    .data(co2Forest)
    .enter()
    .append('circle')
    .attr('cx', function(d,i){
        if(d.Power != '..'){
            console.log(d.Power)
            console.log(x(d.Power))
            return x(d.Power)
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
        
        if(d.CO2 == '..' || d.Power == '..'){
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
    .call(d3.axisBottom(x))
    
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Electric power consumption (kWh per capita)");
    
    
    svg.append("g")
    .call(d3.axisLeft(y))
    

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("CO2 emissions (metric tons per capita)");

}





function co2GDPScene() {

    selectedOption = d3.select("#selectButton").property('value')


    var x = d3.scaleLinear().domain([0,70000]).range([ 0, width ])
    var y = d3.scaleLinear().domain([0,20]).range([ height, 0])

    //Country_filter = _.where(data, {"Country Name": Country});

    CO2_filter = _.where(data2, {"Series Name": "CO2 emissions (metric tons per capita)"});
    Forest_filter = _.where(data2, {"Series Name": "GDP per capita (current US$)"});

    C02_array = _.pluck(CO2_filter, selectedOption);
    Forest_array = _.pluck(Forest_filter, selectedOption);
    CountryName_array = _.pluck(CO2_filter, 'Country Name');


    var co2Forest = []
    for (let index = 0; index < CountryName_array.length; index++) {
        co2Forest.push({'Country': CountryName_array[index], 'CO2': C02_array[index], 'GDP': Forest_array[index]})
        
    }

    var mousemove = function(d) {
        tooltip
        .html("Region: " + d.Country + " CO2 emissions (metric tons per capita): " + d.CO2 + " GDP per capita (current US$): " + d.GDP)
        .style("left", (d3.mouse(this)[0] + 120) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.mouse(this)[1] + 180) + "px")
    }

    svg.append('g')
    .selectAll('dot')
    .data(co2Forest)
    .enter()
    .append('circle')
    .attr('cx', function(d,i){
        if(d.GDP != '..'){
            return x(d.GDP)
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
        
        if(d.CO2 == '..' || d.GDP == '..'){
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
    .call(d3.axisBottom(x))
    
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("GDP per capita (current US$)");
    
    
    svg.append("g")
    .call(d3.axisLeft(y))
    

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("CO2 emissions (metric tons per capita)");

}


function changeChart(val){
    chart = chart + val
    if(chart == 0){
        chart = 3
    } else if(chart == 4) {
        chart = 1
    }

    chartRender(selectedOption)


}



    // When the button is changed, run the updateChart function
d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    chartRender()
})





chartRender()




