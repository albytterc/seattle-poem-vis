import * as d3 from "d3";
import { useEffect } from "react";

const margin = { top: 40, right: 0, bottom: 60, left: 60 };

function addLegend(keys: string[], x: number, y: number) {
  const Svg = d3.select("#my_dataviz").append("g");
  // Usually you have a color scale in your chart already
  let color = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10);

  // Add one dot in the legend for each name.
  Svg.selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
    .classed("legend-dot", true)
    .attr("cx", x)
    .attr("cy", function (d, i) {
      return y + i * 25 - 5;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .attr("fill", (d: any) => color(d) as string)
    .attr("stroke", (d: any) => color(d) as string);

  // Add one dot in the legend for each name.
  Svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .classed("legend-text", true)
    .attr("x", x + 20)
    .attr("y", function (d, i) {
      return y + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("fill", function (d) {
      return color(d) as string;
    })
    .attr("stroke", function (d) {
      return color(d) as string;
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}

function createChart(
  data: any,
  width: number,
  height: number,
  xLabel: string,
  yLabel: string,
  title: string
) {
  const xScale = d3
    .scaleBand()
    .domain(new Set(data.map((d: any) => d.groupBy)))
    .range([0, width])
    .padding(0.5);

  const yScale = d3.scaleLinear().domain([0, 100]).nice().range([height, 0]);

  const subgroups = new Set<string>(data.map((d: any) => d.x));
  const color = d3.scaleOrdinal().domain(subgroups).range(d3.schemeCategory10);

  addLegend(Array.from(subgroups), width - margin.right - 200, margin.top);

  const svg = d3
    .select("#my_dataviz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const chart = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add x-axis
  const xAxis = chart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  xAxis.selectAll("path, line").attr("stroke", "white");
  xAxis
    .selectAll("text")
    .attr("stroke", "white")
    .attr("fill", "white")
    .style("font-size", "14px");

  // add x axis label
  svg
    .append("text")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", height + margin.top + margin.bottom)
    .style("font-size", "16px")
    .text(xLabel);

  // Add y-axis
  const yAxis = chart
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(")
    .call(d3.axisLeft(yScale));

  yAxis.selectAll("path, line").attr("stroke", "white");
  yAxis
    .selectAll("text")
    .attr("stroke", "white")
    .attr("fill", "white")
    .style("font-size", "14px");

  // add y axis label
  svg
    .append("text")
    .attr("fill", "white")
    .attr("transform", "translate(" + width / 2 + ",0)rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -width / 2 + margin.left / 2 - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(yLabel);

  // Add title
  svg
    .append("text")
    .attr("id", "chart-title")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("fill", "white")
    .text(title);

  chart
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d: any) => xScale(d.groupBy) as number)
    .attr("y", height)
    .attr("height", 0)
    .attr("width", xScale.bandwidth())
    .attr("fill", (d: any) => color(d.x) as string)
    .transition()
    .duration(500)
    .attr("y", (d: any) => yScale(d.y))
    .attr("height", (d: any) => height - yScale(d.y));
}

interface StackedBarChartProps {
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
  title: string;
  data: any;
  updateOnPage?: number;
}

function StackedBarChart({
  width,
  height,
  xLabel,
  yLabel,
  title,
  data,
  updateOnPage,
}: StackedBarChartProps) {
  useEffect(() => {
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    createChart(data, chartWidth, chartHeight, xLabel, yLabel, title);
  }, []);

  return (
    <div className="absolute m-auto top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      <svg id="my_dataviz"></svg>
    </div>
  );
}

export default StackedBarChart;
