import { useEffect, useState } from "react";
import * as d3 from "d3";
import VisWrapper from "../components/VisWrapper";
import LineChart from "../components/LineChart";

function Vis1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      let rawData = await d3.csv("./data/total-homeless.csv");
      setData(parseData(rawData) as any);
    };
    load();
  }, []);

  const parseData = (data: any): { x: number; y: number }[] => {
    const x = data.map((d: any) => parseInt(d["Year"]));
    const y = data.map((d: any) => parseInt(d["Homeless population"]));
    let list = [];
    for (let i = 0; i < x.length; i++) {
      list.push({ x: x[i], y: y[i] });
    }
    return list as { x: number; y: number }[];
  };

  return (
    <VisWrapper>
      {data.length > 0 && (
        <LineChart
          width={1280}
          height={600}
          xLabel="Years"
          yLabel="Homeless Population"
          title="Seattle Homeless Population Over Time"
          data={data}
        />
      )}
    </VisWrapper>
  );
}

export default Vis1;
