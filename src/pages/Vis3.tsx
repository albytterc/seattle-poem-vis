import { useEffect, useState } from "react";
import * as d3 from "d3";
import VisWrapper from "../components/VisWrapper";
import BarChart from "../components/BarChart";

function Vis3() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      let rawData = await d3.csv("./data/demographics-homelessness.csv");
      setData(parseData(rawData) as any);
    };
    load();
  }, []);

  const parseData = (data: any) => {
    const filteredData = data.filter(
      (d: any) => d["Year"] === "2020" && d["Demographic"] === "Health status"
    );
    const x = filteredData.map((d: any) => d["Characteristic"]);
    const y = filteredData.map((d: any) => parseInt(d["Percent"]));
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
          xLabel="Health Status"
          yLabel="Percent of Homeless Afflicted"
          title="Seattle Homelessness Health Status"
          data={data}
        />
      )}
    </VisWrapper>
  );
}

export default Vis3;
