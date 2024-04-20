// Load CSV data
d3.csv("wildfire_data.csv").then(function(data) {
  // Create an object to store counts for each state
  const stateCounts = {};

  // Iterate over the data to count wildfires for each state
  data.forEach(function(d) {
      const state = d.STATE;
      if (stateCounts[state] === undefined) {
          stateCounts[state] = 1;
      } else {
          stateCounts[state]++;
      }
  });

  // Convert stateCounts object to an array of objects
  const stateData = Object.keys(stateCounts).map(state => ({
      STATE: state,
      Count: stateCounts[state]
  }));

  // Sort stateData by count in descending order
  stateData.sort((a, b) => b.Count - a.Count);

  // Create SVG
  let width = 500, height = 1000;
  let margin = {
      top: 20, 
      bottom: 50,
      left: 100, 
      right:10
  };

  let svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  // Define Scales
  const yScale = d3.scaleBand()
      .domain(stateData.map(d => d.STATE))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

  const xScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.Count)])
      .range([margin.left, width - margin.right]);

  // Add axes
  let yAxis = svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft().scale(yScale));

  let xAxis = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom().scale(xScale));

  // Add title
  svg.append("text")
      .attr('transform', "translate("+(width/1.65)+","+(margin.top-5)+")")
      .style("text-anchor","middle")
      .text("U.S. Wildfires (1992-2015)");

  yAxis.append('text')
    .attr("transform", "rotate(-90)")
    .attr('x', 0 - ((height - (margin.bottom))/2))
    .attr('y', -30)
    .style('stroke', 'black')
    .text('State');

  xAxis.append('text')
      .attr('x', ((width+margin.left) / 2))
      .attr('y', 30)
      .style('stroke', 'black')
      .text('Wildfire Count');

  // Draw bars
  svg.selectAll('rect')
      .data(stateData)
      .enter()
      .append('rect')
      .attr('x', margin.left)
      .attr('y', d => yScale(d.STATE))
      .attr('width', d => xScale(d.Count) - margin.left)
      .attr('height', yScale.bandwidth()) 
      .attr('fill', 'orange');

});
