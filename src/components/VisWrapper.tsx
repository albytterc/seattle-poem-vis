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
      <div
        className={`absolute right-0 ${
          pageIndex === 17 ? "animate-pulse" : ""
        }`}
      >
        <button
          className="bg-white p-2"
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
