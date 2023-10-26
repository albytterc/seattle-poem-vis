import { useContext, useState } from "react";

import { PageContext } from "../PageContext";
import poem from "../data/poem";

function PoemViewer() {
  const { pageIndex } = useContext(PageContext);
  const [showVerse, setShowVerse] = useState(false);
  const [showAll, setShowAll] = useState(false);

  return (
    <div
      className={`z-50 text-white absolute top-[25px] left-[25px] transition ease-in-out duration-300 ${
        showVerse || showAll ? "bg-black/[.85]" : ""
      } w-fit px-4 py-2`}
      onMouseEnter={() => {
        if (!showAll) setShowVerse(true);
      }}
      onMouseLeave={() => setShowVerse(false)}
    >
      <h1 className="font-inria-serif text-5xl mb-3">
        Ballad of the Lost City
      </h1>
      {!showVerse && !showAll && (
        <p className="font-jost font-bold text-2xl">
          {poem[pageIndex - 1].text}
        </p>
      )}
      {showVerse && (
        <div>
          {poem.map((o) => {
            if (o.verse === poem[pageIndex - 1].verse) {
              return (
                <p
                  className={`font-jost ${
                    o.text === poem[pageIndex - 1].text ? "font-bold" : ""
                  } text-2xl`}
                >
                  {o.text}
                </p>
              );
            }
          })}
          <img
            className="m-auto py-3 cursor-pointer"
            alt="Expand"
            src="/arrow-down.svg"
            onClick={() => {
              setShowVerse(false);
              setShowAll(true);
            }}
          />
        </div>
      )}
      {showAll && (
        <div>
          {poem.map((o) => {
            return (
              <p
                className={`font-jost ${
                  o.text === poem[pageIndex - 1].text ? "font-bold" : ""
                } text-2xl whitespace-pre-line`}
              >
                {o.text}
              </p>
            );
          })}
          <img
            className="m-auto py-3 cursor-pointer"
            alt="Collapse"
            src="/arrow-up.svg"
            onClick={() => {
              setShowAll(false);
              setShowVerse(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PoemViewer;
