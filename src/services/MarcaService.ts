import { supabase } from "../config/supabaseClient";
import { Marca } from "../models/Marca";

const TABLA = "marcas";

export const MarcaService = {
  /** Obtener todas las marcas ordenadas por nombre */
  async obtenerTodas(): Promise<Marca[]> {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .order("nombre", { ascending: true });

    if (error) throw new Error(error.message);
    return data as Marca[];
  },

  /** Buscar una marca por nombre */
  async buscarPorNombre(nombre: string): Promise<Marca | null> {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .eq("nombre", nombre)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as Marca | null;
  },

  /** Crear una nueva marca */
  async crear(marca: Omit<Marca, "idmarca" | "creado_en">): Promise<Marca> {
    // Validar duplicado
    const existente = await this.buscarPorNombre(marca.nombre);
    if (existente) throw new Error(`La marca "${marca.nombre}" ya existe.`);

    const nuevaMarca = {
      ...marca,
      estado: marca.estado ?? true, // por defecto activa
      creado_en: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLA)
      .insert([nuevaMarca])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Marca;
  },

  /** Actualizar una marca existente */
  async actualizar(idMarca: string, marca: Partial<Marca>): Promise<Marca> {
    if (marca.nombre) {
      marca.nombre = marca.nombre.toUpperCase().trim();
      const duplicado = await this.buscarPorNombre(marca.nombre);
      if (duplicado && duplicado.idmarca !== idMarca) {
        throw new Error(`Ya existe otra marca con el nombre "${marca.nombre}".`);
      }
    }

    // Asegurar que el estado sea booleano si se envía
    if (marca.estado !== undefined) {
      marca.estado = Boolean(marca.estado);
    }

    const { data, error } = await supabase
      .from(TABLA)
      .update(marca)
      .eq("idmarca", idMarca)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Marca;
  },

  /** Cambiar estado (activar/desactivar) */
  async cambiarEstado(idMarca: string, estado: boolean): Promise<Marca> {
    const { data, error } = await supabase
      .from(TABLA)
      .update({ estado })
      .eq("idmarca", idMarca)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Marca;
  },

  /** Eliminar una marca */
  async eliminar(idMarca: string): Promise<void> {
    const { error } = await supabase.from(TABLA).delete().eq("idmarca", idMarca);
    if (error) throw new Error(error.message);
  },
};
