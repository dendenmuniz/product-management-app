import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { ProductsProvider } from "./context/ProductsContext";
import { HomePage } from "./pages/HomePage";
import { MainLayout } from "./layouts/MainLayout";
import { ProductPage } from "./pages/ProductPage";
import { ProductsPage } from "./pages/ProductsPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Route>
    )
  );
  return (
    <ProductsProvider>
      <RouterProvider router={router} />
    </ProductsProvider>
  );
};

export default App;
