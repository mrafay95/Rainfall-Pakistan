
var data;
var grouped_data

async function loadData() {

    data = await d3.csv('Rainfall_1901_2016_PAK.csv');
}

loadData().then(() => {


    grouped_data = d3.group(data, d => d.Year)

    console.log(grouped_data)

    grouped_data.forEach(function(d,i){
        
        grouped_data.set(i,d3.mean(_.pluck(grouped_data.get(i), 'Rainfall_MM')))
    })

    console.log(grouped_data)

})







