import { BrowserRouter } from "react-router-dom";
import Routes from "./container/Routes";
import NavBar from "./components/nav-bar";
import { Toaster } from "react-hot-toast";
// import { ThemeProvider } from "./context/ThemeContext"; // Adjust the import path as needed
// import { AuthProvider } from "./components/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
      <Toaster />
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes />
        </main>
      </div>
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
}

export default App;
