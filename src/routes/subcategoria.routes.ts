import express from "express";
import { SubcategoriaController } from "../controllers/subcategoria.controller";

const router = express.Router();

// Listar todas las subcategorías
router.get("/", SubcategoriaController.listar);

// Crear nueva subcategoría
router.post("/", SubcategoriaController.crear);

// Actualizar subcategoría
router.put("/:id", SubcategoriaController.actualizar);

// Eliminar subcategoría
router.delete("/:id", SubcategoriaController.eliminar);

// ✅ Nuevo: cambiar estado (activar/desactivar)
router.patch("/:id/estado", SubcategoriaController.cambiarEstado);

export default router;
