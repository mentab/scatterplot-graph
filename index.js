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

content.append('p')
	.attr('id', 'legend')
	.text('legend text');

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
			.attr('r', 10)
			.attr('data-xvalue', (d) => d.xFormat)
			.attr('data-yvalue', (d) => d.yFormat)
			.attr('class', 'dot')
			.attr('fill', 'red')
			.on('mouseover', (d) => {
				tooltip.attr('data-year', d.xFormat)
					.style('left', xScale(d.xFormat) - 200 + 'px')
					.style('top', yScale(d.yFormat) - 200 + 'px')
					.style('transition', 'opacity .5s ease-out')
					.style('opacity', .8)
					.html(() => `<p>Time : ${d.Time}<br/>
								Place : ${d.Place}<br/>
								Seconds : ${d.Seconds}<br/>
								Name : ${d.Name}<br/>
								Year : ${d.Year}<br/>
								Nationality : ${d.Nationality}<br/>
								Doping : ${d.Doping}<br/>
								URL : ${d.URL}</p>
					`);
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