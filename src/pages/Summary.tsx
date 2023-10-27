import Vis1 from "./Vis1";
import Vis2 from "./Vis2";
import VisWrapper from "../components/VisWrapper";
import poem from "../data/poem";

function Summary() {
  return (
    <VisWrapper showPoemViewer={false}>
      <div className="grid grid-cols-7 gap-3 relative top-[25px]">
        <div
          className={`text-white relative left-[25px] w-fit px-4 py-2 col-span-3`}
        >
          <h1 className="font-inria-serif text-5xl mb-3">
            Ballad of the Lost City
          </h1>
          <div>
            {poem.map((o) => {
              return (
                <p className={`font-jost text-2xl whitespace-pre-line`}>
                  {o.text}
                </p>
              );
            })}
          </div>
        </div>
        <div className="text-white col-span-4 relative top-5 grid grid-cols-2 gap-10 max-h-[300px] pr-10">
          <img className="h-[200px]" src="vis1.png" alt="Grouped bar chart" />
          <img className="h-[200px]" src="vis2.png" alt="Line chart" />
          <img className="h-[200px]" src="vis3.png" alt="Bar chart" />
          <img className="h-[200px]" src="vis4.png" alt="Stacked bar chart" />
          <img className="h-[200px]" src="vis5.png" alt="Pie chart" />
          <img className="h-[200px]" src="vis6.png" alt="Bar chart" />
        </div>
      </div>
    </VisWrapper>
  );
}

export default Summary;
