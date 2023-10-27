import { useEffect, useState } from "react";
import * as d3 from "d3";
import VisWrapper from "../components/VisWrapper";
import BarChart from "../components/BarChart";

function Vis6() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      let rawData = await d3.csv("./data/access-issues.csv");
      setData(parseData(rawData) as any);
    };
    load();
  }, []);

  const parseData = (data: any) => {
    const x = data.map((d: any) => d["Issue"]);
    const y = data.map((d: any) => parseInt(d["Percent"]));
    let list = [];
    for (let i = 0; i < x.length; i++) {
      list.push({ x: x[i], y: y[i] });
    }
    return list.reverse();
  };

  return (
    <VisWrapper>
      {data.length > 0 && (
        <BarChart
          width={1280}
          height={600}
          xLabel="Issue Accessing Services"
          yLabel="Percent of Homeless Afflicted"
          title="Seattle Homeless Issue Accessing Services"
          data={data}
        />
      )}
    </VisWrapper>
  );
}

export default Vis6;
