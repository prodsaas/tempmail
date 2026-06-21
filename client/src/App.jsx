import "./App.css";
import { useEffect } from "react";
import useCreateEmail from "./hooks/useCreateEmail";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Mails from "./components/mails";

function App() {
  const { createEmail } = useCreateEmail();

  useEffect(() => {
    createEmail();
  }, [createEmail]);

  return (
    <>
      <Navbar />
      <Sidebar />
      <Mails />
    </>
  )
}

export default App