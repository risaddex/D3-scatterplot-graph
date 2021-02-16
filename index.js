//! CONSTS
const width = document.documentElement.clientWidth * 0.9;
const height = document.documentElement.clientHeight * 0.666;
const padding = 40;
const barHeight = height / 100;
const barWidth = (width - padding) / 280;

//! UTILS
const getPlaceHolderDate = (hourTime, year = 2000) => {
  const timeArgs = [].concat(hourTime.split(':'));
  return new Date(year, 0, 12, 12, timeArgs[0], timeArgs[1])
}

//! SVG
const svg =
  d3.select('.chart-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

let dataset
let Year
let color

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
  (e, json) => {

   dataset = json.map((item,i) => item);

  //! SCALES
  const xScale =
    d3.scaleLinear()
      .domain([d3.min(dataset, d => d.Year - 1), d3.max(dataset, d => d.Year) + 1]) //? thanks for the hint FCC guy :) it looks much prettier this way!
      .range([padding, width - padding]);

  const yScale =
    d3.scaleTime()
      .domain([d3.max(dataset, d => getPlaceHolderDate(d.Time)), d3.min(dataset, d => getPlaceHolderDate(d.Time))])
      .range([height - padding, padding]);

  // !AXIS FORMAT
  const xAxis =
    d3.axisBottom()
      .scale(xScale)
      .ticks(15, "Y");

  const yAxis =
    d3.axisLeft()
      .scale(yScale)
      .tickFormat(d3.timeFormat("%M:%S"))
      .ticks(20);

  //! TOOLTIP
  const tooltip = d3.select('.chart-container')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  //! AXIS CALLS

  const mainXaxis = svg
    .append('g')
    .attr("transform", `translate(0,${height - padding})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  const mainYaxis = svg
    .append('g')
    .attr("transform", `translate(${padding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);

  // !DOTS

  const dots = svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => xScale(d.Year))
    .attr('cy', (d, i) => yScale(getPlaceHolderDate(d.Time)))
    .attr('r', 6)
    .attr('class', (d) => d.Doping ? 'dot doping' : 'dot no-doping')
    .attr('data-xvalue', (d, i) => (d.Year))
    .attr('data-yvalue', (d, i) => getPlaceHolderDate(d.Time))
    .on('mouseover', (d) => {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', .9)
        .attr('data-year', d.Year)
      tooltip
        .html(`
          <p>
            <strong>Name</strong>: ${d.Name}<br />
            <strong>Time</strong>: ${d.Time}<br />
            <strong>Year</strong>: ${d.Year}<br />
            ${
              d.Doping
                ? `<br />
                  ${d.Doping}
                `
                : ''
              }
          </p>
          
        `)
        .style('left', `${d3.event.screenX - padding}px`)
        .style('top', `${d3.event.clientY - padding * 2}px`)
    })
    .on('mouseout', () => {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0)
    })
});


    