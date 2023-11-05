import * as d3 from "d3";
import { useEffect } from "react";

const margin = { top: 40, bottom: 0, left: 0, right: 600 };
let color: any;

function highlightCause(
  cause: string,
  colorFn: d3.ScaleOrdinal<any, any, any>
) {
  // no filter applied, show all colors as normal
  if (cause === "") {
    d3.selectAll(".pie-arc")
      .transition()
      .duration(500)
      .attr("fill", (d: any) => colorFn(d.data.key));

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
    const arcs = d3.selectAll(".pie-arc");
    arcs.classed("highlight", (b: any) => {
      return b.data.key === cause;
    });

    const legendRows = d3.selectAll(".legend-row");
    legendRows.classed("highlight", (d: any) => {
      return d === cause;
    });

    /** HIGHLIGHTING SELECTED CAUSE **/

    // highlighting selected bars
    d3.selectAll(".pie-arc.highlight")
      .transition()
      .duration(500)
      .attr("fill", (d: any) => colorFn(d.data.key));

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

    d3.selectAll(".pie-arc:not(.highlight)")
      .transition()
      .duration(500)
      .attr("fill", "#111");
  }
}

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

function createChart(data: any, radius: number, title: string) {
  const chartWidth = radius * 2 + margin.left + margin.right;
  const chartHeight = radius * 2 + margin.top + margin.bottom;

  // make pie chart start from 12 o'clock and read clockwise
  data = data.reverse();
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
  color = d3
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
    .classed("pie-arc", true)
    .transition()
    .duration(500) // Animation duration in milliseconds
    .attrTween("d", function (d: any) {
      var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return function (t) {
        return path(interpolate(t));
      };
    });

  arc
    .append("text")
    .text((d: any) => {
      return d.data.y + "%";
    })
    .attr("transform", function (d) {
      return "translate(" + path.centroid(d) + ")";
    })
    .attr("fill", "none")
    .classed("pie-val", true)
    .style("text-anchor", "middle")
    .style("font-size", 17);

  svg.selectAll("path").on("mouseover", (d: any) => {
    d3.selectAll(".pie-val").attr("fill", "white");
  });

  svg.selectAll("path").on("mouseout", (d: any) => {
    d3.selectAll(".pie-val").attr("fill", "none");
  });
}

interface PieChartProps {
  radius: number;
  title: string;
  data: any;
}

function PieChart({ radius, title, data }: PieChartProps) {
  useEffect(() => {
    createChart(data, radius, title);
    selectRow();
  }, []);
  return (
    <div className="absolute m-auto top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      <svg id="my_dataviz"></svg>
    </div>
  );
}

export default PieChart;
