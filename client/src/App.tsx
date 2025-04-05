import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MainLayout } from "./layouts/MainLayout";
import { ProductPage } from "./pages/ProductPage";
import { ProductsPage } from "./pages/ProductsPage";
import { AppProviders } from "./context/AppProviders";
import { LoginPage } from "./pages/LoginPage";



const App = () => {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout children={undefined} />}>
        <Route index element={<HomePage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    )
  );
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;
