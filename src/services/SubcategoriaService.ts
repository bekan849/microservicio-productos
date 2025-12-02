import { supabase } from "../config/supabaseClient";
import { Subcategoria } from "../models/Subcategoria";

const TABLA = "subcategorias";

export const SubcategoriaService = {
  /* =====================================================
     Obtener todas las subcategorías
  ====================================================== */
  async obtenerTodas(): Promise<Subcategoria[]> {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .order("nombre", { ascending: true });

    if (error) throw new Error(error.message);
    return data as Subcategoria[];
  },

  /* =====================================================
     Buscar por nombre
  ====================================================== */
  async buscarPorNombre(nombre: string): Promise<Subcategoria | null> {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .eq("nombre", nombre.toUpperCase().trim())
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as Subcategoria | null;
  },
 
  /* =====================================================
     Crear nueva subcategoría
  ====================================================== */
  async crear(
    subcategoria: Omit<Subcategoria, "idsubcategoria" | "creadoEn">
  ): Promise<Subcategoria> {

    // Normalizar nombre
    const nombreNormalizado = subcategoria.nombre.toUpperCase().trim();

    // Validar duplicado
    const existente = await this.buscarPorNombre(nombreNormalizado);
    if (existente) {
      throw new Error(`La subcategoría "${nombreNormalizado}" ya existe.`);
    }

    const nuevaSubcategoria = {
      ...subcategoria,
      nombre: nombreNormalizado,
      estado: subcategoria.estado ?? true, // default boolean
    };

    const { data, error } = await supabase
      .from(TABLA)
      .insert([nuevaSubcategoria])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Subcategoria;
  },

  /* =====================================================
     Actualizar subcategoría
  ====================================================== */
async actualizar(
  idSubcategoria: string,
  subcategoria: Partial<Subcategoria>
): Promise<Subcategoria> {

  const payload: any = {};

  if (subcategoria.nombre !== undefined)
    payload.nombre = subcategoria.nombre;

  if (subcategoria.descripcion !== undefined)
    payload.descripcion = subcategoria.descripcion;

  if (subcategoria.categoriaid !== undefined)
    payload.categoriaid = subcategoria.categoriaid; // FIX

  if (subcategoria.estado !== undefined)
    payload.estado = subcategoria.estado;

  const { data, error } = await supabase
    .from(TABLA)
    .update(payload)
    .eq("idsubcategoria", idSubcategoria)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Subcategoria;
}
,

  /* =====================================================
     Eliminar subcategoría
  ====================================================== */
  async eliminar(idSubcategoria: string): Promise<void> {
    const { error } = await supabase
      .from(TABLA)
      .delete()
      .eq("idsubcategoria", idSubcategoria);

    if (error) throw new Error(error.message);
  },

  /* =====================================================
     Cambiar estado boolean (activar/desactivar)
  ====================================================== */
  async cambiarEstado(
    idSubcategoria: string,
    estado: boolean
  ): Promise<Subcategoria> {

    const { data, error } = await supabase
      .from(TABLA)
      .update({ estado })
      .eq("idsubcategoria", idSubcategoria)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Subcategoria;
  }
};
