
var data;
var grouped_data

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

}






