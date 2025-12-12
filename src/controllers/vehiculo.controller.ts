// src/controllers/vehiculo.controller.ts
import { Request, Response } from "express";
import { VehiculoService } from "../services/VehiculoService";

export const VehiculoController = {
  /* =====================================================
     Listar
  ====================================================== */
  async listar(req: Request, res: Response) {
    try {
      const vehiculos = await VehiculoService.obtenerTodos();
      res.json(vehiculos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /* =====================================================
     Crear
  ====================================================== */
  async crear(req: Request, res: Response) {
    try {
      const vehiculo = req.body;

      // ❌ Nunca permitimos que el cliente defina codigovehic
      if ("codigovehic" in vehiculo) {
        delete vehiculo.codigovehic;
      }

      if (!vehiculo.nombre) {
        return res
          .status(400)
          .json({ message: "El nombre del vehículo es obligatorio." });
      }

      if (!vehiculo.idcategoria || !vehiculo.idsubcategoria || !vehiculo.idmarca) {
        return res.status(400).json({
          message: "Categoría, subcategoría y marca son obligatorias.",
        });
      }

      if (vehiculo.stock === undefined || vehiculo.stock === null) {
        return res
          .status(400)
          .json({ message: "El stock del vehículo es obligatorio." });
      }

      // Normalizar nombre
      vehiculo.nombre = String(vehiculo.nombre).toUpperCase().trim();

      // Forzar boolean
      vehiculo.estado =
        vehiculo.estado === undefined ? true : !!vehiculo.estado;

      const nuevo = await VehiculoService.crear(vehiculo);
      res.status(201).json(nuevo);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /* =====================================================
     Actualizar
  ====================================================== */
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehiculo = req.body;

      // ❌ codigovehic es inmodificable
      if ("codigovehic" in vehiculo) {
        delete vehiculo.codigovehic;
      }

      if (vehiculo.nombre) {
        vehiculo.nombre = String(vehiculo.nombre).toUpperCase().trim();
      }

      if (vehiculo.estado !== undefined) {
        vehiculo.estado = !!vehiculo.estado;
      }

      const actualizado = await VehiculoService.actualizar(id, vehiculo);
      res.json(actualizado);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /* =====================================================
     Eliminar
  ====================================================== */
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await VehiculoService.eliminar(id);
      res.json({ message: "Vehículo eliminado correctamente" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /* =====================================================
     Cambiar estado (activar / desactivar)
     PATCH /vehiculos/:id/estado   { "estado": true | false }
  ====================================================== */
  async cambiarEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (estado === undefined) {
        return res
          .status(400)
          .json({ message: "El campo 'estado' es obligatorio." });
      }

      const updated = await VehiculoService.cambiarEstado(id, !!estado);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
