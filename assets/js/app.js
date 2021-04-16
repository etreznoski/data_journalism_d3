const svgWidth = 900;
const svgHeight = 700;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 40
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

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(healthData => {

  // parse data
  healthData.forEach(data => {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  let xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty) * .95,
          d3.max(healthData, d => d.poverty)
        ])
        .range([0, width]);
  // yLinearScale function above csv import
  let yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  const bottomAxis = d3.axisBottom(xLinearScale);
  const leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  let xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  let circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", 0.5)
    .attr("stroke", "black")
    .text(d => d.abbr);

  const textGroup = chartGroup.append("g")
  const stateLabel = textGroup.selectAll("text")
    .data(healthData)
    .join("text")
    .attr("x", d => (xLinearScale(d.poverty)) - 6)
    .attr("y", d => (yLinearScale(d.healthcare)) + 5)
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("font-weight", "700")
    .attr("fill", "black");

  // Create group for two x-axis labels
  const labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  const povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty %");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare %");

  // // updateToolTip function above csv import
  // circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  // // x axis labels event listener
  // labelsGroup.selectAll("text")
  //   .on("click", function() {
  //     // get value of selection
  //     const value = d3.select(this).attr("value");
  //     if (value !== chosenXAxis) {
  //
  //       // replaces chosenXAxis with value
  //       chosenXAxis = value;
  //
  //       // console.log(chosenXAxis)
  //
  //       // functions here found above csv import
  //       // updates x scale for new data
  //       xLinearScale = xScale(healthData, chosenXAxis);
  //
  //       // updates x axis with transition
  //       xAxis = renderAxes(xLinearScale, xAxis);
  //
  //       // updates circles with new x values
  //       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
  //
  //       // updates tooltips with new info
  //       circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  //
  //       // changes classes to change bold text
  //       if (chosenXAxis === "poverty") {
  //         povertyLabel
  //           .classed("active", true)
  //           .classed("inactive", false);
  //         ageLabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //       }
  //       else {
  //         povertyLabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //         ageLabel
  //           .classed("active", true)
  //           .classed("inactive", false);
  //       }
  //     }
  //   });
}).catch(error => console.log(error));
