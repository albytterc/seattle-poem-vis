import { useContext } from "react";
import { PageContext } from "../PageContext";

function Welcome() {
  const { pageIndex, setPageIndex } = useContext(PageContext);
  const handleArrowClick = () => {
    setPageIndex(pageIndex + 1);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-cover bg-no-repeat bg-[top]">
      <section className="absolute bottom-20 left-[57px] text-white text-left inline-block font-inria-sans">
        <h1 className="m-0 text-[5vw]">
          <b>Vis for the Lost City</b>
        </h1>
        <div className="flex flex-row gap-2 items-center">
          <p className="m-0 text-[3vw]">
            An interactive poetry visualization of homelessness in Seattle
          </p>
          <img
            className="w-[4vw] h-[4vw] cursor-pointer"
            alt="Enter arrow"
            src="/group-8.svg"
            onClick={handleArrowClick}
          />
        </div>
      </section>
    </div>
  );
}

export default Welcome;
