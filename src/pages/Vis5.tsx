import { useEffect, useState } from "react";
import * as d3 from "d3";
import VisWrapper from "../components/VisWrapper";
import PieChart from "../components/PieChart";

function Vis5() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      let rawData = await d3.csv("./data/sheltered-status.csv");
      setData(parseData(rawData) as any);
    };
    load();
  }, []);

  const parseData = (data: any) => {
    data = data.filter((d: any) => d["Year"] === "2020");
    const groupBy = data.map((d: any) => d["Location type"]);
    const key = data.map((d: any) => d["Shelter type"]);
    const y = data.map((d: any) => parseInt(d["Percent"]));
    let list = [];
    for (let i = 0; i < key.length; i++) {
      list.push({ groupBy: groupBy[i], key: key[i], y: y[i] });
    }
    return list.sort((a, b) => a.y - b.y);
  };

  return (
    <VisWrapper>
      {data.length > 0 && (
        <PieChart
          radius={250}
          title="Seattle Homeless Living Status"
          data={data}
        />
      )}
    </VisWrapper>
  );
}

export default Vis5;
