import { Request, Response } from "express";
import { CategoriaService } from "../services/CategoriaService";

export const CategoriaController = {
  /** Listar todas las categorías */
  async listar(req: Request, res: Response) {
    try {
      const categorias = await CategoriaService.obtenerTodas();
      res.json(categorias);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /** Crear nueva categoría */
  async crear(req: Request, res: Response) {
    try {
      const categoria = req.body;
      categoria.nombre = categoria.nombre.toUpperCase().trim();
      categoria.estado = categoria.estado ?? true; // por defecto true

      const nueva = await CategoriaService.crear(categoria);
      res.status(201).json(nueva);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /** Actualizar datos de una categoría */
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoria = req.body;

      // Si se pasa el estado desde el body, convertir a booleano
      if (categoria.estado !== undefined) {
        categoria.estado = Boolean(categoria.estado);
      }

      const actualizada = await CategoriaService.actualizar(id, categoria);
      res.json(actualizada);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /** Cambiar el estado (activar/desactivar) */
  async cambiarEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const categoria = await CategoriaService.cambiarEstado(id, Boolean(estado));
      res.json({
        message: `Categoría ${estado ? "activada" : "desactivada"} correctamente.`,
        categoria,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /** Eliminar una categoría */
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await CategoriaService.eliminar(id);
      res.json({ message: "Categoría eliminada correctamente" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
