import * as d3 from "d3";
import { useEffect } from "react";

const margin = { top: 40, bottom: 0, left: 0, right: 600 };

function addLegend(
  keys: string[],
  x: number,
  y: number,
  colorFn: d3.ScaleOrdinal<any, any, any>
) {
  const Svg = d3.select("#my_dataviz").append("g");

  // Add one dot in the legend for each name.
  Svg.selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
    .classed("legend-dot", true)
    .attr("cx", x)
    .attr("cy", function (d, i) {
      return y + i * 25 - 5;
    })
    .attr("r", 7)
    .attr("fill", (d: any) => colorFn(d) as string)
    .attr("stroke", (d: any) => colorFn(d) as string);

  // Add one dot in the legend for each name.
  Svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .classed("legend-text", true)
    .attr("x", x + 20)
    .attr("y", function (d, i) {
      return y + i * 25;
    })
    .attr("fill", function (d) {
      return colorFn(d) as string;
    })
    .attr("stroke", function (d) {
      return colorFn(d) as string;
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}

function createChart(data: any, radius: number, title: string) {
  const chartWidth = radius * 2 + margin.left + margin.right;
  const chartHeight = radius * 2 + margin.top + margin.bottom;

  var svg = d3
    .select("#my_dataviz")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

  let chart = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + chartWidth / 2 + "," + (radius + margin.top) + ")"
    );

  svg
    .append("text")
    .attr("id", "chart-title")
    .attr("x", chartWidth / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("fill", "white")
    .text(title);

  // set the color scale
  var color = d3
    .scaleOrdinal()
    .domain(data as any)
    .range(d3.schemeTableau10);

  addLegend(
    data.map((d: any) => d.key),
    chartWidth / 2 + radius,
    margin.top + 10,
    color
  );

  // Compute the position of each group on the pie:
  var pie = d3.pie().value((d: any) => d.y);
  let arc = chart.selectAll("arc").data(pie(data)).enter();
  let path = d3
    .arc()
    .innerRadius(radius / 3)
    .outerRadius(radius) as any;

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  arc
    .append("path")
    .attr("d", path)
    .attr("fill", (d: any) => color(d.data.key) as any)
    .attr("stroke", "black")
    .style("stroke-width", "2px");

  arc
    .selectAll("path")
    .transition()
    .duration(500) // Animation duration in milliseconds
    .attrTween("d", function (d: any) {
      var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return function (t) {
        return path(interpolate(t));
      };
    });

  let colorSum = data.reduce((sum: any, curr: any) => (sum += curr.y), 0);
}

interface PieChartProps {
  radius: number;
  title: string;
  data: any;
  updateOnPage?: number;
}

function PieChart({ radius, title, data, updateOnPage }: PieChartProps) {
  useEffect(() => {
    createChart(data, radius, title);
  }, []);
  return (
    <div className="absolute m-auto top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      <svg id="my_dataviz"></svg>
    </div>
  );
}

export default PieChart;
