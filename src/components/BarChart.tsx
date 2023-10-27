import * as d3 from "d3";
import { useEffect } from "react";

const margin = { top: 40, right: 0, bottom: 200, left: 60 };

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
    .domain(data.map((d: any) => d.x))
    .range([0, width])
    .padding(0.1);
  const yScale = d3.scaleLinear().domain([0, 100]).nice().range([height, 0]);

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
    .call(
      d3.axisBottom(xScale).tickFormat((d, i) => {
        const maxLengthTick = 30;
        if (d.length > maxLengthTick) {
          return d.substring(0, maxLengthTick - 3).trimEnd() + "...";
        }
        return d;
      })
    );

  xAxis.selectAll("path, line").attr("stroke", "white");
  xAxis
    .selectAll("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-45)")
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
    .selectAll()
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d: any) => xScale(d.x) as number)
    .attr("y", height)
    .attr("height", 0)
    .attr("width", xScale.bandwidth())
    .attr("fill", "#F6CD38")
    .transition()
    .duration(500)
    .attr("y", (d: any) => yScale(d.y))
    .attr("height", (d: any) => height - yScale(d.y));
}

interface BarChartProps {
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
  title: string;
  data: any;
  updateOnPage?: number;
}

function BarChart({
  width,
  height,
  xLabel,
  yLabel,
  title,
  data,
  updateOnPage,
}: BarChartProps) {
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

export default BarChart;
