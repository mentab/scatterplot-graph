const w = 900;
const h = 600;
const m = 60;

const dopingColor = 'orange';
const noDopingColor = 'lightblue';

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

const legend = svg.append('g')
	.attr('id', 'legend');

legend.append('circle')
	.attr('cx', w - w / 5)
	.attr('cy', h - h / 20)
	.attr('r', 5)
	.attr('fill', dopingColor);

legend.append('circle')
	.attr('cx', w - w / 5)
	.attr('cy', h - h / 20 + 20)
	.attr('r', 5)
	.attr('fill', noDopingColor);

legend.append('text')
	.attr('x', w - w / 5 + 10)
	.attr('y', h - h / 20)
	.style('alignment-baseline', 'middle')
	.text('Riders with doping allegations');

legend.append('text')
	.attr('x', w - w / 5 + 10)
	.attr('y', h - h / 20 + 20)
	.style('alignment-baseline', 'middle')
	.text('No doping allegations');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
	.then((data) => {
		const dataset = data;

		dataset.forEach(function (d) {
			d.xFormat = new Date(d.Year, 0, 1);
			d.yFormat = new Date(1970, 0, 1, 0, 0, d.Seconds);
		});

		const xScale = d3.scaleTime()
			.domain(d3.extent(dataset, (d) => d.xFormat))
			.range([m, w - m]);

		const yScale = d3.scaleLinear()
			.domain(d3.extent(dataset, (d) => d.yFormat))
			.range([h - m, m]);

		svg.selectAll('circle')
			.data(dataset)
			.enter()
			.append('circle')
			.attr('cx', (d) => xScale(d.xFormat))
			.attr('cy', (d) => yScale(d.yFormat))
			.attr('r', 6)
			.attr('data-xvalue', (d) => d.xFormat)
			.attr('data-yvalue', (d) => d.yFormat)
			.attr('class', 'dot')
			.attr('fill', (d) => d.Doping ? dopingColor : noDopingColor)
			.style('stroke', 'black')
			.on('mouseover', (d) => {
				tooltip.attr('data-year', d.xFormat)
					.style('left', xScale(d.xFormat) + 10 + 'px')
					.style('top', yScale(d.yFormat) - 10 + 'px')
					.style('opacity', .9)
					.html(() => `<p>${d.Name} : ${d.Nationality}<br/>
					Year : ${d.Year}, Time : ${d.Time}
					${d.Doping ? '<br/><br/>Doping : ' + d.Doping : ''}</p>`);
			})
			.on('mouseout', function () {
				tooltip.style('opacity', 0)
					.html(() => '');
			});;

		const xAxis = d3.axisBottom(xScale)
			.tickFormat(d3.timeFormat("%Y"));

		const yAxis = d3.axisLeft(yScale)
			.tickFormat(d3.timeFormat("%M:%S"));

		svg.append('g')
			.attr('transform', 'translate(0,' + (h - m) + ')')
			.attr('id', 'x-axis')
			.call(xAxis);

		svg.append('g')
			.attr('transform', 'translate(' + m + ', 0)')
			.attr('id', 'y-axis')
			.call(yAxis);
	});