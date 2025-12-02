import express from "express";
import { CategoriaController } from "../controllers/categoria.controller";

const router = express.Router();

// Listar todas las categorías
router.get("/", CategoriaController.listar);

// Crear nueva categoría
router.post("/", CategoriaController.crear);

// Actualizar categoría
router.put("/:id", CategoriaController.actualizar);

// Eliminar categoría
router.delete("/:id", CategoriaController.eliminar);

// ✅ Nuevo: cambiar estado (activar/desactivar)
router.patch("/:id/estado", CategoriaController.cambiarEstado);

export default router;
