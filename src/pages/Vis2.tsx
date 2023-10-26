import { useEffect, useState } from "react";
import * as d3 from "d3";
import VisWrapper from "../components/VisWrapper";
import GroupedBarChart from "../components/GroupedBarChart";

function Vis2() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      let rawData = await d3.csv("./data/cause-homelessness.csv");
      setData(parseData(rawData) as any);
    };
    load();
  }, []);

  const parseData = (data: any) => {
    const x = data.map((d: any) => d["Cause"]);
    const y = data.map((d: any) => parseInt(d["Percent"]));
    const groupBy = data.map((d: any) => d["Year"]);
    let list = [];
    for (let i = 0; i < x.length; i++) {
      list.push({ x: x[i], y: y[i], groupBy: groupBy[i] });
    }

    return list.reverse();
  };

  return (
    <VisWrapper>
      {data.length > 0 && (
        <GroupedBarChart
          width={1280}
          height={600}
          xLabel="Years"
          yLabel="Percent Homeless due to Cause"
          title="Seattle Homelessness by Cause Over Time"
          data={data}
          updateOnPage={4}
        />
      )}
    </VisWrapper>
  );
}

export default Vis2;
