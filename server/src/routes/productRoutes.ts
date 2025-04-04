import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  importProducts,
} from "../controllers/productController";

const router = Router();

router.post("/", authMiddleware, createProduct);
router.post("/import", authMiddleware, importProducts);
router.get("/", authMiddleware, getAllProducts);
router.get("/:id", authMiddleware, getProductById);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
