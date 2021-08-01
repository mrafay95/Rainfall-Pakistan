


async function loadData() {

    d = await d3.csv('Rainfall_1901_2016_PAK.csv');
    return d;
}

var data = loadData()

var grouped_data = d3.group(data, d => d.Year)

console.log(grouped_data)





