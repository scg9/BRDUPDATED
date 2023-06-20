import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <HomePage />,
    },
  ],
  {
    basename: "/brd-automate" || "/",
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
