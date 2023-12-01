import { PropsWithChildren, useContext } from "react";
import { PageContext } from "../PageContext";
import PoemViewer from "./PoemViewer";
import Stepper from "./Stepper";

interface VisWrapperProps {
  showPoemViewer?: boolean;
  showStepper?: boolean;
}

function VisWrapper({
  showPoemViewer = true,
  showStepper = true,
  children,
}: PropsWithChildren<VisWrapperProps>) {
  const { pageIndex, setPageIndex } = useContext(PageContext);
  return (
    <div className="h-screen w-screen bg-black/[.85] relative">
      {showPoemViewer && <PoemViewer />}
      <div className={`absolute right-0 flex flex-row gap-1`}>
        <button
          className={`bg-[#D9D9D9] p-2 rounded ${
            pageIndex === 1 ? "animate-pulse" : ""
          }`}
          onClick={() =>
            alert(
              "The poem loads one line at a time underneath the title. Use the arrow keys or the buttons at the bottom to navigate.\n\nPlay around with the charts and poem to interact with them!"
            )
          }
        >
          Help
        </button>
        <button
          className={`bg-[#D9D9D9] p-2 rounded ${
            pageIndex === 17 ? "animate-pulse" : ""
          }`}
          onClick={() => window.location.reload()}
        >
          Restart
        </button>
      </div>
      {children}
      {showStepper && <Stepper />}
    </div>
  );
}

export default VisWrapper;
