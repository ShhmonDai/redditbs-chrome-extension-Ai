import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Generator from "./pages/Generator";
import Profile from "./pages/Profile";
import { PAGES } from "./utils/pages";
import { loadData } from "./utils/localStorage";

function App() {

  // State management
  const [page, setPage] = useState(PAGES.GENERATOR);
  const [openAIKey, setOpenAIKey] = useState();

  // Load data from local storage on component mount
  useEffect(() => {
    const fetchLocalData = async () => {
      const localOpenAIKey = await loadData("openAIKey");

      setOpenAIKey(localOpenAIKey);
    };

    fetchLocalData();
  }, []);


  // Render components based on the current page
  switch (page) {
    case PAGES.GENERATOR:
      return (
        <Generator setPage={setPage} openAIKey={openAIKey} />
      );

    case PAGES.PROFILE:
      return (
        <Profile
          setPage={setPage}
          setOpenAIKey={setOpenAIKey}
          openAIKey={openAIKey}
        />
      );

    default:
      return (
        <Generator setPage={setPage} openAIKey={openAIKey} />
      );
  }
}

export default App
