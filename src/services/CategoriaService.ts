import { supabase } from "../config/supabaseClient";
import { Categoria } from "../models/Categoria";

const TABLA = "categorias";

export const CategoriaService = {
  /** ======================================================
   *  OBTENER TODAS
   * ====================================================== */
  async obtenerTodas(): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .order("nombre", { ascending: true });

    if (error) throw new Error(error.message);
    return data as Categoria[];
  },

  /** ======================================================
   *  BUSCAR POR NOMBRE
   * ====================================================== */
  async buscarPorNombre(nombre: string): Promise<Categoria | null> {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .eq("nombre", nombre)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as Categoria | null;
  },

  /** ======================================================
   *  CREAR
   * ====================================================== */
  async crear(categoria: Omit<Categoria, "idcategoria" | "creado_en">): Promise<Categoria> {
    // Validación duplicado
    const existente = await this.buscarPorNombre(categoria.nombre.toUpperCase().trim());
    if (existente) {
      throw new Error(`La categoría "${categoria.nombre}" ya existe.`);
    }

    const nuevaCategoria = {
      ...categoria,
      nombre: categoria.nombre.toUpperCase().trim(),
      estado: categoria.estado ?? true,
      creado_en: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLA)
      .insert([nuevaCategoria])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Categoria;
  },

  /** ======================================================
   *  ACTUALIZAR
   * ====================================================== */
  async actualizar(idcategoria: string, categoria: Partial<Categoria>): Promise<Categoria> {
    // Normalizar nombre
    if (categoria.nombre) {
      categoria.nombre = categoria.nombre.toUpperCase().trim();

      // Validación duplicado
      const duplicado = await this.buscarPorNombre(categoria.nombre);
      if (duplicado && duplicado.idcategoria !== idcategoria) {
        throw new Error(`Ya existe otra categoría con el nombre "${categoria.nombre}".`);
      }
    }

    // Estado a booleano
    if (categoria.estado !== undefined) {
      categoria.estado = Boolean(categoria.estado);
    }

    const { data, error } = await supabase
      .from(TABLA)
      .update(categoria)
      .eq("idcategoria", idcategoria) // ← correcto
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Categoria;
  },

  /** ======================================================
   *  CAMBIAR ESTADO
   * ====================================================== */
  async cambiarEstado(idcategoria: string, estado: boolean): Promise<Categoria> {
    const { data, error } = await supabase
      .from(TABLA)
      .update({ estado })
      .eq("idcategoria", idcategoria)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Categoria;
  },

  /** ======================================================
   *  ELIMINAR
   * ====================================================== */
  async eliminar(idcategoria: string): Promise<void> {
    const { error } = await supabase
      .from(TABLA)
      .delete()
      .eq("idcategoria", idcategoria);

    if (error) throw new Error(error.message);
  }
};
