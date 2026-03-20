import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { AppDataProvider } from "./context/AppDataContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AppDataProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AppRouter />
        </BrowserRouter>
      </AppDataProvider>
    </ThemeProvider>
  );
}

export default App;
