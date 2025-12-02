import express from "express";
import { MarcaController } from "../controllers/marca.controller";

const router = express.Router();

// Listar todas las marcas
router.get("/", MarcaController.listar);

// Crear nueva marca
router.post("/", MarcaController.crear);

// Actualizar marca
router.put("/:id", MarcaController.actualizar);

// Eliminar marca
router.delete("/:id", MarcaController.eliminar);

// ✅ Nuevo: cambiar estado (activar/desactivar)
router.patch("/:id/estado", MarcaController.cambiarEstado);

export default router;
