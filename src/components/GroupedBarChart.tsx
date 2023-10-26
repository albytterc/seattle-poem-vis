import * as d3 from "d3";
import { useContext, useEffect } from "react";
import { PageContext } from "../PageContext";

const margin = { top: 40, right: 0, bottom: 40, left: 70 };

function addLegend(keys: string[], x: number, y: number) {
  const Svg = d3.select("#my_dataviz").append("g");
  // Usually you have a color scale in your chart already
  let color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSpectral[keys.length]);

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
  title: string,
  chart?: any
) {
  // group by
  const fx = d3
    .scaleBand()
    .domain(new Set(data.map((d: any) => d.groupBy)))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.1);

  // Both x and color encode the cause class.
  const cause = new Set<string>(data.map((d: any) => d.x));
  addLegend(Array.from(cause), width - margin.right - 200, margin.top);

  const x = d3.scaleBand().domain(cause).rangeRound([0, fx.bandwidth()]);

  const color = d3
    .scaleOrdinal()
    .domain(cause)
    .range(d3.schemeSpectral[cause.size])
    .unknown("#ccc");

  // Y encodes the height of the bar.
  const y = d3
    .scaleLinear()
    // @ts-ignore
    .domain([0, d3.max(data, (d: any) => d.y)])
    .nice()
    .range([height, 0]);

  // A function to format the value in the tooltip.
  // const formatValue = (x) => (isNaN(x) ? "N/A" : x.toLocaleString("en"));

  // Create the SVG container.
  const svg = d3
    .select("#my_dataviz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Append a group for each state, and a rect for each age.
  svg
    .append("g")
    .attr("height", height)
    .attr("width", width)
    .selectAll()
    .data(d3.group(data, (d: any) => d.groupBy))
    .join("g")
    .attr("height", height)
    .attr("width", width)
    .attr("transform", ([groupBy]) => `translate(${fx(groupBy)},0)`)
    .selectAll()
    .data(([, d]) => d.sort((a: any, b: any) => a.y - b.y))
    .join("rect")
    .classed("bar", true)
    .attr("x", (d: any) => x(d.x) as number)
    .attr("width", x.bandwidth())
    .attr("fill", (d: any) => color(d.x) as string)
    .attr("stroke", (d: any) => color(d.x) as string)
    .attr("height", 0)
    .attr("y", height + margin.top)
    .transition()
    .duration(500)
    .attr("y", (d: any) => y(d.y) + margin.top)
    .attr("height", (d: any) => height - y(d.y));

  // Append the horizontal axis.
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height + margin.top})`)
    .call(d3.axisBottom(fx));

  xAxis.selectAll("path").attr("stroke", "white");
  xAxis.selectAll("line").attr("stroke", "white");
  xAxis
    .selectAll("text")
    .attr("stroke", "white")
    .attr("fill", "white")
    .style("font-size", "14px");

  xAxis
    .append("text")
    .attr("fill", "white")
    .attr("x", width / 2)
    .attr("y", 40)
    .style("font-size", "16px")
    .text(xLabel);

  // Append the vertical axis.
  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(d3.axisLeft(y).ticks(null, "s"));

  yAxis.selectAll("path, line").attr("stroke", "white");
  yAxis
    .selectAll("text")
    .attr("stroke", "white")
    .attr("fill", "white")
    .style("font-size", "14px");

  yAxis
    .append("text")
    .attr("fill", "white")
    .attr("transform", "translate(" + width / 2 + ",0)rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -width / 2 - margin.left / 2 - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(yLabel);

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

function updateVis(pageIndex: number, pageToUpdateOn: number) {
  if (pageIndex === pageToUpdateOn) {
    highlightCause();
  }
}

function highlightCause() {
  const bars = d3.selectAll(".bar");
  bars.classed("highlight", (b: any) => {
    return b.x === "Alcohol or drug use";
  });

  d3.selectAll(".bar:not(.highlight)")
    .transition()
    .duration(500)
    .attr("fill", "#111");

  const dots = d3.selectAll(".legend-dot");
  dots.classed("highlight", (d: any) => {
    return d === "Alcohol or drug use";
  });

  d3.selectAll(".legend-dot:not(.highlight)")
    .transition()
    .duration(500)
    .attr("fill", "#111");

  d3.selectAll(".legend-text").classed("highlight", (b: any) => {
    return b === "Alcohol or drug use";
  });

  d3.selectAll(".legend-text:not(.highlight)")
    .transition()
    .duration(500)
    .style("opacity", 0.5);
}

interface GroupedBarChartProps {
  width: number;
  height: number;
  xLabel: string;
  yLabel: string;
  title: string;
  data: any;
  updateOnPage?: number;
}

function GroupedBarChart({
  width,
  height,
  xLabel,
  yLabel,
  title,
  data,
  updateOnPage,
}: GroupedBarChartProps) {
  const chartHeight = height - margin.top - margin.bottom;
  const chartWidth = width - margin.left - margin.right;
  const { pageIndex } = useContext(PageContext);
  useEffect(() => {
    createChart(data, chartWidth, chartHeight, xLabel, yLabel, title);
    if (updateOnPage) updateVis(pageIndex, updateOnPage);
  }, [pageIndex]);

  return (
    <div className="absolute m-auto top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      <svg id="my_dataviz"></svg>
    </div>
  );
}

export default GroupedBarChart;
