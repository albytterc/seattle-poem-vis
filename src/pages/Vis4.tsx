import { useEffect, useState } from "react";
import * as d3 from "d3";
import VisWrapper from "../components/VisWrapper";
import StackedBarChart from "../components/StackedBarChart";

function Vis4() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      let rawData = await d3.csv("./data/unemployment.csv");
      setData(parseData(rawData) as any);
    };
    load();
  }, []);

  const parseData = (data: any) => {
    const x = data.map((d: any) => d["Employment status"]);
    const y = data.map((d: any) => parseInt(d["Percent"]));
    const groupBy = data.map((d: any) => parseInt(d["Year"]));
    let list = [];
    for (let i = 0; i < x.length; i++) {
      list.push({ x: x[i], y: y[i], groupBy: groupBy[i] });
    }
    return list.reverse();
  };

  return (
    <VisWrapper>
      {data.length > 0 && (
        <StackedBarChart
          width={1280}
          height={600}
          xLabel="Year"
          yLabel="Percent of Employment Status"
          title="Seattle Homelessness Employment Status"
          data={data}
        />
      )}
    </VisWrapper>
  );
}

export default Vis4;
