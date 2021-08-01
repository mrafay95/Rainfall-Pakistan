
var data;

async function loadData() {

    data = await d3.csv('Rainfall_1901_2016_PAK.csv');
}

loadData().then(() => {


    var grouped_data = d3.group(data, d => d.Year)

    console.log(grouped_data)




})







