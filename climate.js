
var data;
var grouped_data;

var Country = 'World';
var Year = '2018'

async function loadData() {

    data = await d3.csv('CO2_Forest_Data.csv');
}

loadData().then(() => {


    co2ForestScene()

    //grouped_data = d3.group(data, d => d.Year)

    //console.log(grouped_data)

    //grouped_data.forEach(function(d,i){
        
        //grouped_data.set(i,d3.mean(_.pluck(grouped_data.get(i), 'Rainfall_MM')))
    //})

    //console.log(grouped_data)



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
        if(d.Forest != '..'{
            return d.Forest
        } else{
            return 0;
        }
        
    })
    .attr('cy', function(d,i){ 
        
        if(d.CO2 != '..'{
            return d.CO2
        } else{
            return 0;
        }
    })


}






