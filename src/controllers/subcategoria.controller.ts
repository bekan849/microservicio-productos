import { Request, Response } from "express";
import { SubcategoriaService } from "../services/SubcategoriaService";

export const SubcategoriaController = {

  /* =====================================================
     Listar subcategorías
  ====================================================== */
  async listar(req: Request, res: Response) {
    try {
      const subcategorias = await SubcategoriaService.obtenerTodas();
      res.json(subcategorias);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /* =====================================================
     Crear subcategoría
  ====================================================== */
  async crear(req: Request, res: Response) {
    try {
      const subcategoria = req.body;

      // Normalizar nombre
      if (!subcategoria.nombre) {
        return res.status(400).json({ message: "El nombre es obligatorio." });
      }

      subcategoria.nombre = subcategoria.nombre.toUpperCase().trim();

      // Estado boolean por defecto
      if (subcategoria.estado === undefined) {
        subcategoria.estado = true;
      }

      const nueva = await SubcategoriaService.crear(subcategoria);
      res.status(201).json(nueva);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /* =====================================================
     Actualizar subcategoría
  ====================================================== */
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subcategoria = req.body;

      // Si envían nombre, normalizarlo
      if (subcategoria.nombre) {
        subcategoria.nombre = subcategoria.nombre.toUpperCase().trim();
      }

      const actualizada = await SubcategoriaService.actualizar(id, subcategoria);
      res.json(actualizada);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /* =====================================================
     Eliminar subcategoría
  ====================================================== */
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await SubcategoriaService.eliminar(id);
      res.json({ message: "Subcategoría eliminada correctamente" });

    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /* =====================================================
     Cambiar estado boolean (activar/desactivar)
  ====================================================== */
  async cambiarEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (typeof estado !== "boolean") {
        return res.status(400).json({ message: "El estado debe ser boolean (true/false)." });
      }

      const actualizada = await SubcategoriaService.cambiarEstado(id, estado);
      res.json(actualizada);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
