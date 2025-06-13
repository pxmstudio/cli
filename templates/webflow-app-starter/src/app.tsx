import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/not-found";
import MainLayout from "./components/layouts/main-layout";
import { Loader2 } from "lucide-react";
import { Button } from "./components/ui/button";
import Page from "./pages";

function ElementRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppRoutes() {
  const authorized = true;
  const loading = false;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return authorized ? (
    <ElementRoutes />
  ) : (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <Button variant="primary" asChild>
        <a href="" target="_blank">
          Login
        </a>
      </Button>
    </div>
  );
}

function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;
