import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

// set the dimensions and margins of the graph
const margin = { top: 30, right: 0, bottom: 10, left: 70 };

function createChart(
  data: any,
  chart: any,
  width: number,
  height: number,
  xLabel: string,
  yLabel: string,
  title: string
) {
  // Add X axis --> it is a date format
  const correctedData = data.map((d: { x: string; y: string }) => {
    return { x: d3.timeParse("%Y")(d.x), y: d.y };
  });

  var x = d3
    .scaleTime()
    .domain(
      // @ts-ignore
      d3.extent(correctedData, (d: any) => d.x)
    )
    .nice()
    .range([0, width]);

  const xAxis = chart
    .append("g")
    .attr("stroke", "white")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  xAxis.selectAll("path").attr("stroke", "white");
  xAxis.selectAll("line").attr("stroke", "white");
  xAxis.selectAll("text").attr("fill", "white").style("font-size", "14px");

  xAxis
    .append("text")
    .attr("fill", "white")
    .attr("x", width / 2)
    .attr("y", 40)
    .style("font-size", "16px")
    .text(xLabel);

  // Add Y axis
  var y = d3
    .scaleLinear()
    // @ts-ignore
    .domain(d3.extent(correctedData, (d: any) => d.y))
    .range([height, 0]);

  const yAxis = chart.append("g").attr("stroke", "white").call(d3.axisLeft(y));

  yAxis.selectAll("path").attr("stroke", "white");
  yAxis.selectAll("line").attr("stroke", "white");
  yAxis.selectAll("text").attr("fill", "white").style("font-size", "14px");
  yAxis
    .append("text")
    .attr("fill", "white")
    .attr("transform", "translate(" + width / 2 + ",0)rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -width / 2 - margin.left / 2 - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(yLabel);

  // Add the line
  const path = chart
    .append("path")
    .data([correctedData.reverse()])
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x((d: any) => x(d.x))
        .y((d: any) => y(d.y))
    );

  path
    .attr("stroke-dashoffset", path.node().getTotalLength())
    .attr("stroke-dasharray", path.node().getTotalLength())
    .transition()
    .ease(d3.easeSin)
    .duration(500)
    .attr("stroke-dashoffset", 0);

  d3.select("#my_dataviz")
    .append("text")
    .attr("id", "chart-title")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("fill", "white")
    .text(title);
}

type DataPoint = { x: number | string; y: number | string };
type LineChartProps = {
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
  title: string;
  data: DataPoint[];
};

export const LineChart = ({
  width,
  height,
  xLabel,
  yLabel,
  title,
  data,
}: LineChartProps) => {
  useEffect(() => {
    // append the svg object to the body of the page
    const svg = d3
      .select("#my_dataviz")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("fill", "white")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    createChart(data, svg, chartWidth, chartHeight, xLabel, yLabel, title);
  }, []);

  return (
    <div className="absolute m-auto top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      <svg id="my_dataviz"></svg>
    </div>
  );
};

export default LineChart;
