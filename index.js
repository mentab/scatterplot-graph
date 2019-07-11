const w = 750;
const h = 400;
const m = 60;

const content = d3.select('.content');

content.append('h1')
	.attr('id', 'title')
	.text('Doping in Professional Bicycle Racing');

content.append('h2')
	.attr('id', 'subtitle')
	.text('35 Fastest times up Alpe d\'Huez');

const tooltip = content.append('div')
	.attr('id', 'tooltip')
	.style('position', 'absolute')
	.style('opacity', 0);

const svg = content.append('svg')
	.attr('width', w)
	.attr('height', h);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
	.then((data) => {
		const dataset = data;

		const xScale = d3.scaleLinear()
			.domain(d3.extent(dataset, (d) => d.Year))
			.range([m, w - m]);

		const yScale = d3.scaleLinear()
			.domain(d3.extent(dataset, (d) => d.Seconds))
			.range([h - m, m]);

		svg.selectAll('circle')
			.data(dataset)
			.enter()
			.append('circle')
			.attr('cx', 50)
			.attr('cy', 50)
			.attr('r', 50)
			.attr('class', 'dot')
			.attr('fill', 'red');

		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);

		svg.append('g')
			.attr('transform', 'translate(0,' + (h - m) + ')')
			.attr('id', 'x-axis')
			.call(xAxis);

		svg.append('g')
			.attr('transform', 'translate(' + m + ', 0)')
			.attr('id', 'y-axis')
			.call(yAxis);
	});