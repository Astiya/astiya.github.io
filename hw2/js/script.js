
const width = 1000;
const height = 500;
const margin = 30;
const svg  = d3.select('#scatter-plot')
            .attr('width', width)
            .attr('height', height);

let xParam = 'fertility-rate';
let yParam = 'child-mortality';
let radius = 'gdp';
let year = '2000';

const params = ['child-mortality', 'fertility-rate', 'gdp', 'life-expectancy', 'population'];
const colors = ['aqua', 'lime', 'gold', 'hotpink'];

// Шкалы для осей и окружностей
const x = d3.scaleLinear().range([margin*2, width-margin]);
const y = d3.scaleLinear().range([height-margin, margin]);

const xLable = svg.append('text').attr('transform', `translate(${width/2}, ${height})`);
const yLable = svg.append('text').attr('transform', `translate(${margin/2}, ${height/2}) rotate(-90)`);

// Part 1: задайте атрибуты 'transform' для осей
const xAxis = svg.append('g').attr('transform', `translate(0, ${height-margin})`);
const yAxis = svg.append('g').attr('transform', `translate(${margin*2}, 0) rotate(90)`);


// Part 2: Шкалы для цвета и радиуса объектов
const color = d3.scaleOrdinal(colors);
const r = d3.scaleSqrt();

// Part 2: для элемента select задайте options (http://htmlbook.ru/html/select) и установить selected для начального значения
d3.select('#radius').selectAll('option')
.data(params)
.enter()
.append('option')
.text(function(d)
{return d});
d3.select('#radius').selectAll('option').nodes()[0].selected = true;


// Part 3: select с options для осей
d3.select('#OSy').selectAll('option')
.data(params)
.enter()
.append('option')
.text(function(d)
{return d});
d3.select('#OSy').selectAll('option').nodes()[1].selected = true;

d3.select('#OSx').selectAll('option')
.data(params)
.enter()
.append('option')
.text(function(d)
{return d});
d3.select('#OSx').selectAll('option').nodes()[2].selected = true;

loadData().then(data => {

    console.log(data)

    // Part 2: получитe все уникальные значения из поля 'region' при помощи d3.nest и установите их как 'domain' цветовой шкалы
    let regions = d3.nest().key(function(d)
	{return d['region'];})
	.entries(data)
	.map(d=>d.key);
	
    color.domain(regions);

    d3.select('.slider').on('change', newYear);

    d3.select('#radius').on('change', newRadius);

    // Part 3: подпишитесь на изменения селекторов параметров осей
    d3.select('#OSx').on('change', newOSx);

    d3.select('#OSy').on('change', newOSy);

    function newYear(){
        year = this.value;
        updateChart()
    }

    function newRadius(){
		radius = this.value;
        updateChart()
    }
	function newOSx(){
		xParam = this.value;
        updateChart()
    }
	function newOSy(){
		yParam = this.value;
        updateChart()
    }
    function updateChart(){
        xLable.text(xParam);
        yLable.text(yParam);
        d3.select('.year').text(year);

        // поскольку значения показателей изначально представленны в строчном формате преобразуем их в Number при помощи +
        let xRange = data.map(d=> +d[xParam][year]);
        x.domain([d3.min(xRange), d3.max(xRange)]);

        xAxis.call(d3.axisBottom(x));    

        // Part 1: реализуйте отображение оси 'y'
         let yRange = data.map(d=> +d[yParam][year]);
        y.domain([d3.min(yRange), d3.max(yRange)]);

        yAxis.call(d3.axisBottom(y));
		
        
        // Part 2: реализуйте обновление шкалы радиуса
         let rRange = data.map(d=> +d[radius][year]);
        r.domain([d3.min(yRange), d3.max(rRange)]);

        // xAxis.call(d3.axisBottom(r));

        // Part 1, 2: реализуйте создание и обновление состояния точек
        /* svg.selectAll('circle').data(data)
		.join('circle')
		.attr("cx",function(d) {
        return +d[xParam][year]); */
        //     ...
    }
    
    updateChart();
});


async function loadData() {
    const population = await d3.csv('data/pop.csv');
    const rest = { 
        'gdp': await d3.csv('data/gdppc.csv'),
        'child-mortality': await d3.csv('data/cmu5.csv'),
        'life-expectancy': await d3.csv('data/life_expect.csv'),
        'fertility-rate': await d3.csv('data/tfr.csv')
    };
    const data = population.map(d=>{
        return {
            geo: d.geo,
            country: d.country,
            region: d.region,
            population: {...d},
            ...Object.values(rest).map(v=>v.find(r=>r.geo===d.geo)).reduce((o, d, i)=>({...o, [Object.keys(rest)[i]]: d }), {})
            
        }
    })
    return data
}