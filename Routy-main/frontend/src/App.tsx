import { BrowserRouter } from "react-router-dom";
import Routes from "./container/Routes";
import NavBar from "./components/nav-bar";
import { Toaster } from "react-hot-toast";
// import { ThemeProvider } from "./context/ThemeContext"; // Adjust the import path as needed

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
