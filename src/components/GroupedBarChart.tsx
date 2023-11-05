import * as d3 from "d3";
import { useContext, useEffect } from "react";
import { PageContext } from "../PageContext";

const margin = { top: 40, right: 0, bottom: 40, left: 70 };
let color: any;

function addLegend(
  keys: string[],
  x: number,
  y: number,
  color: d3.ScaleOrdinal<any, any, any>
) {
  const Svg = d3.select("#my_dataviz").append("g").classed("legend", true);

  // Add one dot in the legend for each name.
  const legendRows = Svg.selectAll("mylegendrow")
    .data(keys)
    .enter()
    .append("g")
    .classed("legend-row", true)
    .style("cursor", "pointer");

  // adds legend circle for each row
  legendRows
    .append("circle")
    .classed("legend-dot", true)
    .attr("cx", x)
    .attr("cy", function (d, i) {
      return y + i * 25 - 5;
    })
    .attr("r", 7)
    .attr("fill", (d: any) => color(d) as string)
    .attr("stroke", (d: any) => color(d) as string);

  // adds legend text for each row
  legendRows
    .append("text")
    .classed("legend-text", true)
    .attr("x", x + 20)
    .attr("y", (d, i) => y + i * 25)
    .text((d) => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("fill", (d) => color(d) as string)
    .attr("stroke", (d) => color(d) as string);
}

function selectRow() {
  d3.selectAll(".legend-row").on("click", function () {
    let selectedRow = d3.select(this);

    // @ts-ignore
    const highlightedCause = selectedRow.node().__data__;

    if (selectedRow.classed("highlighted")) {
      selectedRow.classed("highlighted", false);
      highlightCause("", color);
    } else {
      d3.selectAll(".legend-row").classed("highlighted", false);
      selectedRow.classed("highlighted", true);
      highlightCause(highlightedCause, color);
    }
  });
}

function highlightCause(
  cause: string,
  colorFn: d3.ScaleOrdinal<any, any, any>
) {
  // no filter applied, show all colors as normal
  if (cause === "") {
    d3.selectAll(".bar")
      .transition()
      .duration(500)
      .attr("fill", (d: any) => colorFn(d.x));

    // highlighting selected text
    d3.selectAll(".legend-row .legend-text")
      .transition()
      .duration(500)
      .style("opacity", 1);

    // highlighting selected dots
    d3.selectAll(".legend-row .legend-dot")
      .transition()
      .duration(500)
      .attr("fill", (d: any) => colorFn(d));
  } else {
    const bars = d3.selectAll(".bar");
    bars.classed("highlight", (b: any) => {
      return b.x === cause;
    });

    const legendRows = d3.selectAll(".legend-row");
    legendRows.classed("highlight", (d: any) => {
      return d === cause;
    });

    /** HIGHLIGHTING SELECTED CAUSE **/

    // highlighting selected bars
    d3.selectAll(".bar.highlight")
      .transition()
      .duration(500)
      .attr("fill", (d: any) => colorFn(d.x));

    // highlighting selected text
    d3.selectAll(".legend-row.highlight .legend-text")
      .transition()
      .duration(500)
      .style("opacity", 1);

    // highlighting selected dots
    d3.selectAll(".legend-row.highlight .legend-dot")
      .transition()
      .duration(500)
      .attr("fill", (d: any) => colorFn(d));

    // unhighlight all other causes
    const unselectedRows = d3.selectAll(".legend-row:not(.highlight)");
    unselectedRows
      .selectAll(".legend-text")
      .transition()
      .duration(500)
      .style("opacity", 0.5);

    unselectedRows
      .selectAll(".legend-dot")
      .transition()
      .duration(500)
      .attr("fill", "#111");

    d3.selectAll(".bar:not(.highlight)")
      .transition()
      .duration(500)
      .attr("fill", "#111");
  }
}

function createChart(
  data: any,
  width: number,
  height: number,
  xLabel: string,
  yLabel: string,
  title: string,
  showAnimation: boolean
) {
  d3.selectAll("#my_dataviz *").remove();
  // group by
  const fx = d3
    .scaleBand()
    .domain(new Set(data.map((d: any) => d.groupBy)))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.1);

  // Both x and color encode the cause class.
  const cause = new Set<string>(data.map((d: any) => d.x));
  color = d3.scaleOrdinal().domain(cause).range(d3.schemeSpectral[cause.size]);

  addLegend(Array.from(cause), width - margin.right - 200, margin.top, color);

  const x = d3.scaleBand().domain(cause).rangeRound([0, fx.bandwidth()]);

  // Y encodes the height of the bar.
  const y = d3
    .scaleLinear()
    // @ts-ignore
    .domain([0, d3.max(data, (d: any) => d.y)])
    .nice()
    .range([height, 0]);

  // Create the SVG container.
  const svg = d3
    .select("#my_dataviz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Append a group for each state, and a rect for each age.
  if (showAnimation) {
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
      .data(([, d]) => d)
      .join((enter) => {
        const g = enter.append("g");
        g.append("rect");
        g.append("text")
          .classed("bar-val", true)
          .text((d: any) => d.y)
          .attr("fill", "none")
          .attr("text-anchor", "middle")
          .attr("x", (d: any) => (x(d.x) as number) + x.bandwidth() / 2)
          .attr("y", (d: any) => (y(d.y) + margin.top - 5) as number);
        return g.select("rect");
      })
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
  } else {
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
      .data(([, d]) => d)
      .join((enter) => {
        const g = enter.append("g");
        g.append("rect");
        g.append("text")
          .classed("bar-val", true)
          .text((d: any) => d.y)
          .attr("fill", "none")
          .attr("text-anchor", "middle")
          .attr("x", (d: any) => (x(d.x) as number) + x.bandwidth() / 2)
          .attr("y", (d: any) => (y(d.y) + margin.top - 5) as number);
        return g.select("rect");
      })
      .classed("bar", true)
      .attr("x", (d: any) => x(d.x) as number)
      .attr("width", x.bandwidth())
      .attr("stroke", (d: any) => color(d.x) as string)
      .attr("y", (d: any) => y(d.y) + margin.top)
      .attr("height", (d: any) => height - y(d.y))
      .attr("fill", (d: any) => color(d.x) as string)
      .transition()
      .duration(500)
      .attr("fill", (d: any) => color(d.x) as string);
  }

  // svg.selectAll(".bar").append("text").text("Hello").style("color", "white").style("font-size", "14px").attr("x", (d: any) => x(d.x) as number).attr("y", (d: any) => y(d.y) as number)

  svg.selectAll(".bar").on("mouseover", function (b: any) {
    // make bars show exact value
    d3.selectAll(".bar-val").attr("fill", "white");
  });
  svg.selectAll(".bar").on("mouseout", function (b: any) {
    // make bars show exact value
    d3.selectAll(".bar-val").attr("fill", "none");
  });
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
    createChart(data, chartWidth, chartHeight, xLabel, yLabel, title, true);
  }, []);

  useEffect(() => {
    if (pageIndex === updateOnPage) {
      console.log("creating chart and highlighting cause");
      createChart(data, chartWidth, chartHeight, xLabel, yLabel, title, false);
      setTimeout(() => {
        highlightCause("Alcohol or drug use", color);
      }, 100);
    } else if (updateOnPage && pageIndex === updateOnPage - 1) {
      highlightCause("", color)
    }
    selectRow();
  }, [pageIndex]);

  return (
    <div className="absolute m-auto top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      <svg id="my_dataviz"></svg>
    </div>
  );
}

export default GroupedBarChart;
