import VisWrapper from "../components/VisWrapper";
import poem from "../data/poem";

function Summary() {
  return (
    <VisWrapper showPoemViewer={false}>
      <div
        className={`text-white relative top-[25px] left-[25px] w-fit px-4 py-2`}
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
    </VisWrapper>
  );
}

export default Summary;
