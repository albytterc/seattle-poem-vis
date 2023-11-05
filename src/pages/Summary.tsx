import VisWrapper from "../components/VisWrapper";
import poem from "../data/poem";
import { useContext } from "react";
import { PageContext } from "../PageContext";

function Summary() {
  const { pageIndex, setPageIndex } = useContext(PageContext);
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
            {poem.map((o, i) => {
              return (
                <p onClick={() => setPageIndex(i + 1)} className={`font-jost text-2xl whitespace-pre-line`}>
                  {o.text}
                </p>
              );
            })}
          </div>
        </div>
        <div className="text-white col-span-4 relative top-5 grid grid-cols-2 gap-10 max-h-[300px] pr-10">
          <img
            onClick={() => setPageIndex(1)}
            className="h-[200px] cursor-pointer"
            src="vis1.png"
            alt="Grouped bar chart"
          />
          <img
            onClick={() => setPageIndex(5)}
            className="h-[200px] cursor-pointer"
            src="vis2.png"
            alt="Line chart"
          />
          <img
            onClick={() => setPageIndex(7)}
            className="h-[200px] cursor-pointer"
            src="vis3.png"
            alt="Bar chart"
          />
          <img
            onClick={() => setPageIndex(8)}
            className="h-[200px] cursor-pointer"
            src="vis4.png"
            alt="Stacked bar chart"
          />
          <img
            onClick={() => setPageIndex(9)}
            className="h-[200px] cursor-pointer"
            src="vis5.png"
            alt="Pie chart"
          />
          <img
            onClick={() => setPageIndex(14)}
            className="h-[200px] cursor-pointer"
            src="vis6.png"
            alt="Bar chart"
          />
        </div>
      </div>
    </VisWrapper>
  );
}

export default Summary;
