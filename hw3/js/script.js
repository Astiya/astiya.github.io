const b_width = 1000;
const d_width = 500;
const b_height = 1000;
const d_height = 1000;
const colors = [
    '#DB202C','#a6cee3','#1f78b4',
    '#33a02c','#fb9a99','#b2df8a',
    '#fdbf6f','#ff7f00','#cab2d6',
    '#6a3d9a','#ffff99','#b15928']

const radius = d3.scaleLinear().range([0.5, 20]);
const color = d3.scaleOrdinal().range(colors);
const x = d3.scaleLinear().range([0, b_width]);

const bubble = d3.select('.bubble-chart')
    .attr('width', b_width).attr('height', b_height);
const donut = d3.select('.donut-chart')
    .attr('width', d_width).attr('height', d_height)
    .append("g")
        .attr("transform", "translate(" + d_width / 2 + "," + d_height / 2 + ")");

const donut_lable = d3.select('.donut-chart').append('text')
        .attr('class', 'donut-lable')
        .attr("text-anchor", "middle")
        .attr('transform', `translate(${(d_width/2)} ${d_height/2})`);
const tooltip = d3.select('.tooltip');

//  Part 1 - Создайте симуляцию с использованием forceCenter, forceX и forceCollide
   const simulation = d3.forceSimulation(nodes)
  .force('center', d3.forceCenter(b_width / 2, b_height / 2))
  .force('x', d3.forceX().x(function(d){ return x(+d['release year']);}))
  .force('collision', d3.forceCollide().radius(function(d){ return radius(d['user rating score']);})
  .on('tick', ticked);


d3.csv('data/netflix.csv').then(data=>{
    data = d3.nest().key(d=>d.title).rollup(d=>d[0]).entries(data).map(d=>d.value).filter(d=>d['user rating score']!=='NA');
    console.log(data)
    
    const rating = data.map(d=>+d['user rating score']);
    const years = data.map(d=>+d['release year']);
    let ratings = d3.nest().key(d=>d.rating).rollup(d=>d.length).entries(data);
    
    
    // Part 1 - задайте domain  для шкал
	// console.log(ratings);
    color.domain(ratings);
    x.domain([d3.min(years), d3.max(years)]);
	radius.domain([d3.min(rating), d3.max(rating)]);
    // Part 1 - создайте circles на основе data
    simulation.nodes(data)
    // Part 1 - передайте данные в симуляцию и добавьте обработчик события tick
    function ticked() {
    var nodes = bubble
        .selectAll("circle")
		.data(data)
  // function ticked() {
  // var u = d3.select('svg')
    // .selectAll('circle')
    // .data(data)

  nodes.enter()
    .append('circle')
	.attr("r", function(d) { return radius(d['user rating score']); })
	.attr("fill", function(d) { return color(d["rating"]); })
    .merge(nodes)
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })
	.attr('stroke', 'gray')
    .style('stroke-width', '0px')
    .on('mouseover', overBubble)
    .on('mouseout', outOfBubble)
	
  nodes.exit().remove()
}


    // Part 1 - Создайте шаблон при помощи d3.pie на основе ratings
    var pie = d3.layout.pie()
    .value(function(d) { return d.value.value; });
    
    // Part 1 - Создайте генератор арок при помощи d3.arc
    var arcGenerator = d3.arc()
    .outerRadius(100).innerRadius(140);;
   /*  var pathData = rcGenerator({
	startAngle: 0,
	endAngle: Math.PI / 4 */
// });
    // Part 1 - постройте donut chart внутри donut
    // ..
	var pie_ratings = pie(d3.entries(ratings))
    donut.selectAll('whatever')
      .data(pie_ratings)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', function(d) { return(color(d.data.value.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", '1')
      .on('mouseover', overArc)
      .on('mouseout', outOfArc);
    // добавьте обработчики событий mouseover и mouseout
        //.on('mouseover', overArc)
        //.on('mouseout', outOfArc);

    function overBubble(d){
        console.log(d)
        // Part 2 - задайте stroke и stroke-width для выделяемого элемента   
        // ..
        
        // Part 3 - обновите содержимое tooltip с использованием классов title и year
        // ..

        // Part 3 - измените display и позицию tooltip
        // ..
    }
    function outOfBubble(){
        // Part 2 - обнулите stroke и stroke-width
        // ..
            
        // Part 3 - измените display у tooltip
        // ..
    }

    function overArc(d){
        console.log(d)
        // Part 2 - измените содержимое donut_lable
        // ..
        // Part 2 - измените opacity арки
        // ..

        // Part 3 - измените opacity, stroke и stroke-width для circles в зависимости от rating
        // ..
    }
    function outOfArc(){
        // Part 2 - измените содержимое donut_lable
        // ..
        // Part 2 - измените opacity арки
        // ..

        // Part 3 - верните opacity, stroke и stroke-width для circles
        // ..
    }
});