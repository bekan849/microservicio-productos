import { Request, Response } from "express";
import { ProductoService } from "../services/ProductoService";

export const ProductoController = {

  /* =====================================================
     Listar productos
  ====================================================== */
  async listar(req: Request, res: Response) {
    try {
      const productos = await ProductoService.obtenerTodos();
      res.json(productos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /* =====================================================
     Crear producto
  ====================================================== */
  async crear(req: Request, res: Response) {
    try {
      const producto = req.body;

      if (!producto.nombre) {
        return res.status(400).json({ message: "El nombre es obligatorio." });
      }

      if (!producto.idcategoria || !producto.idsubcategoria || !producto.idmarca) {
        return res.status(400).json({ message: "Categoría, subcategoría y marca son obligatorias." });
      }

      // Normalizar nombre
      producto.nombre = producto.nombre.toUpperCase().trim();

      // Estado por defecto
      if (producto.estado === undefined) producto.estado = true;

      const nuevo = await ProductoService.crear(producto);
      res.status(201).json(nuevo);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /* =====================================================
     Actualizar producto
  ====================================================== */
  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const producto = req.body;

      // Normalizar nombre si fue enviado
      if (producto.nombre) {
        producto.nombre = producto.nombre.toUpperCase().trim();
      }

      const actualizado = await ProductoService.actualizar(id, producto);

      res.json(actualizado);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /* =====================================================
     Eliminar producto
  ====================================================== */
  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await ProductoService.eliminar(id);
      res.json({ message: "Producto eliminado correctamente" });

    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  /* =====================================================
     Cambiar estado (activar/desactivar)
  ====================================================== */
  async cambiarEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (typeof estado !== "boolean") {
        return res.status(400).json({ message: "El estado debe ser boolean (true/false)." });
      }

      const actualizado = await ProductoService.cambiarEstado(id, estado);
      res.json(actualizado);

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
