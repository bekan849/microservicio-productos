import express from "express";
import { ProductoController } from "../controllers/producto.Controller";

const router = express.Router();

// Listar todos los productos
router.get("/", ProductoController.listar);

// Crear nuevo producto
router.post("/", ProductoController.crear);

// Actualizar producto
router.put("/:id", ProductoController.actualizar);

// Eliminar producto
router.delete("/:id", ProductoController.eliminar);

// ✅ Nuevo: cambiar estado (activar/desactivar)
router.patch("/:id/estado", ProductoController.cambiarEstado);

export default router;
