import { useEffect, useState } from "react";

import "./App.css";
import Welcome from "./pages/Welcome";
import Vis1 from "./pages/Vis1";
import Vis2 from "./pages/Vis2";
import Vis3 from "./pages/Vis3";
import Vis4 from "./pages/Vis4";
import Vis5 from "./pages/Vis5";
import Vis6 from "./pages/Vis6";
import Summary from "./pages/Summary";
import { PageContext } from "./PageContext";

function App() {
  const [pageIndex, setPageIndex] = useState(0);
  const numPages = 17;
  let currentComponent = <Welcome />;

  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && pageIndex < numPages) {
        setPageIndex(pageIndex + 1);
      } else if (event.key === "ArrowLeft" && pageIndex > 0) {
        setPageIndex(pageIndex - 1);
      }
    };
    window.addEventListener("keydown", handleArrowKeys);

    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [pageIndex]);

  switch (pageIndex) {
    case 0:
      currentComponent = <Welcome />;
      break;
    case 1:
      currentComponent = <Vis2 />;
      break;
    case 2:
      currentComponent = <Vis2 />;
      break;
    case 3:
      currentComponent = <Vis2 />;
      break;
    case 4:
      currentComponent = <Vis2 />;
      break;
    case 5:
      currentComponent = <Vis1 />;
      break;
    case 6:
      currentComponent = <Vis1 />;
      break;
    case 7:
      currentComponent = <Vis3 />;
      break;
    case 8:
      currentComponent = <Vis4 />; // vis 4
      break;
    case 9:
      currentComponent = <Vis5 />; // vis 5
      break;
    case 10:
      currentComponent = <Vis5 />; // vis 5
      break;
    case 11:
      currentComponent = <Vis5 />; // vis 5
      break;
    case 12:
      currentComponent = <Vis5 />; // vis 5
      break;
    case 13:
      currentComponent = <Vis5 />; // vis 6
      break;
    case 14:
      currentComponent = <Vis6 />; // vis 6
      break;
    case 15:
      currentComponent = <Vis6 />; // vis 6
      break;
    case 16:
      currentComponent = <Vis6 />; // vis 6
      break;
    case 17:
      currentComponent = <Summary />;
      break;
  }

  return (
    <PageContext.Provider value={{ numPages, pageIndex, setPageIndex }}>
      {currentComponent}
    </PageContext.Provider>
  );
}

export default App;
