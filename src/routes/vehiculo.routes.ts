import { Router } from "express";
import { VehiculoController } from "../controllers/vehiculo.controller";

// ✅ Creamos una nueva instancia del router
const router = Router();

// 📍 GET /api/vehiculos
router.get("/", VehiculoController.listar);

// 📍 POST /api/vehiculos
router.post("/", VehiculoController.crear);

// 📍 PUT /api/vehiculos/:id
router.put("/:id", VehiculoController.actualizar);

// 📍 DELETE /api/vehiculos/:id
router.delete("/:id", VehiculoController.eliminar);

export default router;
