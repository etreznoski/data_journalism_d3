const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  let chosenXAxis = "poverty";
  let chosenYAxis = "healthcare";

  // function used for updating x-scale const upon click on axis label
  function xScale(data, chosenXAxis) {
    // create scales
    const xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);

    return xLinearScale;

  }

  // function used for updating y-scale const upon click on axis label
  function xScale(data, chosenYAxis) {
    // create scales
    const yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[chosenXAxis])])
      .range([0, width]);

    return yLinearScale;

  }

  // function used for updating xAxis const upon click on axis label
  function renderAxes(newXScale, xAxis) {
    const bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

  // function used for updating yAxis const upon click on axis label
  function renderAxes(newYScale, yAxis) {
    const leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }


  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  let xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "In Poverty %";
  }
  else {
    xlabel = "Age";
  }

  let ylabel;

  if (chosenYAxis === "healthcare") {
    ylabel = "Lacks Healthcare %";
  }
  else {
    ylabel = "Smokers";
  }

  const toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(d => `${ylabel} ${d[chosenYAxis]}<br>${xlabel} ${d[chosenXAxis]}`);

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
