import { Request, Response } from "express";
import { MarcaService } from "../services/MarcaService";

export const MarcaController = {
  /** Listar todas las marcas */
  async listar(req: Request, res: Response) {
    try {
      const marcas = await MarcaService.obtenerTodas();
      res.json(marcas);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /** Crear nueva marca */
  async crear(req: Request, res: Response) {
    try {
      const marca = req.body;
      marca.nombre = marca.nombre.toUpperCase().trim();
      marca.estado = marca.estado ?? true; // por defecto true

      const nueva = await MarcaService.crear(marca);
      res.status(201).json(nueva);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /** Actualizar marca existente */
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const marca = req.body;

      // Si viene estado en el body, convertir a booleano
      if (marca.estado !== undefined) {
        marca.estado = Boolean(marca.estado);
      }

      const actualizada = await MarcaService.actualizar(id, marca);
      res.json(actualizada);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /** Cambiar estado (activar/desactivar) */
  async cambiarEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const marca = await MarcaService.cambiarEstado(id, Boolean(estado));
      res.json({
        message: `Marca ${estado ? "activada" : "desactivada"} correctamente.`,
        marca,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /** Eliminar marca */
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await MarcaService.eliminar(id);
      res.json({ message: "Marca eliminada correctamente" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
