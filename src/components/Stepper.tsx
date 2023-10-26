import { useContext } from "react";
import { PageContext } from "../PageContext";

const unselectedColor = "#D9D9D9";
const selectedColor = "#F6CD38";

function Stepper() {
  const { numPages, pageIndex, setPageIndex } = useContext(PageContext);
  const pageDots = [];

  for (let i = 0; i < numPages; i++) {
    pageDots.push(
      i !== numPages - 1 ? (
        <svg
          className="cursor-pointer"
          width="13"
          height="13"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => setPageIndex(i + 1)}
        >
          <circle
            cx="7.5"
            cy="7.5"
            r="7.5"
            fill={`${i === pageIndex - 1 ? selectedColor : unselectedColor}`}
          />
        </svg>
      ) : (
        <svg
          className="cursor-pointer"
          width="17"
          height="17"
          viewBox="0 0 18 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => setPageIndex(i + 1)}
        >
          <path
            d="M9 0L11.9571 4.92984L17.5595 6.21885L13.7848 10.5547L14.2901 16.2812L9 14.031L3.70993 16.2812L4.21523 10.5547L0.440492 6.21885L6.04285 4.92984L9 0Z"
            fill={`${i === pageIndex - 1 ? selectedColor : unselectedColor}`}
          />
        </svg>
      )
    );
  }

  return (
    <div className="flex flex-row items-center justify-center gap-3 absolute bottom-7 w-full">
      <img
        className="cursor-pointer"
        alt="left arrow"
        src="/left-arrow.svg"
        onClick={() => setPageIndex(pageIndex - 1)}
      />
      {pageDots.map((e) => e)}
      <img
        className="cursor-pointer"
        alt="right arrow"
        src="/right-arrow.svg"
        onClick={() => {
          if (pageIndex < numPages) setPageIndex(pageIndex + 1);
        }}
      />
    </div>
  );
}

export default Stepper;
