import { PropsWithChildren } from "react";
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
  return (
    <div className="h-screen w-screen bg-black/[.85] relative">
      {showPoemViewer && <PoemViewer />}
      {children}
      {showStepper && <Stepper />}
    </div>
  );
}

export default VisWrapper;
