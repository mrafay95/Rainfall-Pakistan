
var data;
var grouped_data;

var Country = 'World';
var Year = '2018'

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

var svg = d3.select("svg")
    .attr("width", x)
    .attr("height", y)


function updateWindow(){
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    svg.attr("width", x).attr("height", y);
}

async function loadData() {

    data = await d3.csv('CO2_Forest_Data.csv');
}

loadData().then(() => {

    window.onresize = updateWindow;
    co2ForestScene()

})


function co2ForestScene() {

    console.log(data)

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


    d3.select('svg').append('g')
    .attr("transform","translate("+50+","+50+")")
    .selectAll('circle')
    .data(co2Forest)
    .enter()
    .append('circle')
    .attr('cx', function(d,i){
        if(d.Forest != '..'){
            return d.Forest
        } else{
            return 0;
        }
        
    })
    .attr('cy', function(d,i){ 
        
        if(d.CO2 != '..'){
            return d.CO2
        } else{
            return 0;
        }
    }).attr('r', function(d,i){ 
        
        if(d.CO2 != '..' || d.Forest != '..'){
            return 0
        } else{
            return 2;
        }
    })


}






