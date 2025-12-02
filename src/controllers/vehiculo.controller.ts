// src/controllers/vehiculo.controller.ts
import { Request, Response } from "express";
import { VehiculoService } from "../services/VehiculoService";

export const VehiculoController = {
  async listar(req: Request, res: Response) {
    try {
      const vehiculos = await VehiculoService.obtenerTodos();
      res.json(vehiculos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async crear(req: Request, res: Response) {
    try {
      const vehiculo = req.body;
      vehiculo.nombre = vehiculo.nombre.toUpperCase().trim();
      vehiculo.estado = !!vehiculo.estado; // ✅ asegurar booleano
      const nuevo = await VehiculoService.crear(vehiculo);
      res.status(201).json(nuevo);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehiculo = req.body;
      if (vehiculo.nombre) vehiculo.nombre = vehiculo.nombre.toUpperCase().trim();
      if (vehiculo.estado !== undefined) vehiculo.estado = !!vehiculo.estado; // ✅ boolean
      const actualizado = await VehiculoService.actualizar(id, vehiculo);
      res.json(actualizado);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await VehiculoService.eliminar(id);
      res.json({ message: "Vehículo eliminado correctamente" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
