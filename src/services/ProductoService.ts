import { supabase } from "../config/supabaseClient";
import { Producto } from "../models/Producto";

const TABLA = "productos";

/* =====================================================
   Helper: generar código de producto
   Formato: XX + XX + XX + "-" + número correlativo
   Ejemplo: TAANMA-1
===================================================== */
async function generarCodigoProducto(input: {
  nombre: string;
  idcategoria: string;
  idmarca: string;
}): Promise<string> {
  const limpiar = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

  const abreviar2 = (s: string) => {
    const c = limpiar(s);
    if (!c) return "XX";
    return c.slice(0, 2).padEnd(2, "X");
  };

  // Obtener nombres de categoría y marca desde sus tablas
  const { data: catData, error: catErr } = await supabase
    .from("categorias")
    .select("nombre")
    .eq("idcategoria", input.idcategoria)
    .maybeSingle();

  if (catErr) throw new Error(catErr.message);

  const { data: marcaData, error: marcaErr } = await supabase
    .from("marcas")
    .select("nombre")
    .eq("idmarca", input.idmarca)
    .maybeSingle();

  if (marcaErr) throw new Error(marcaErr.message);

  const nombreProd = input.nombre || "";
  const nombreCat = catData?.nombre || "";
  const nombreMarca = marcaData?.nombre || "";

  const prefijo =
    abreviar2(nombreProd) +
    abreviar2(nombreCat) +
    abreviar2(nombreMarca); // ej: TAANMA

  // Buscar el último código con ese prefijo
  const { data: existentes, error: existErr } = await supabase
    .from(TABLA)
    .select("codigoprod")
    .ilike("codigoprod", `${prefijo}-%`)
    .order("codigoprod", { ascending: false })
    .limit(1);

  if (existErr) throw new Error(existErr.message);

  let ultimoNumero = 0;
  if (existentes && existentes.length > 0) {
    const ultimoCodigo = (existentes[0] as any).codigoprod as string;
    const match = ultimoCodigo.match(/-(\d+)$/);
    if (match) {
      ultimoNumero = parseInt(match[1], 10);
    }
  }

  const siguiente = ultimoNumero + 1; // empieza en 1: TAANMA-1
  return `${prefijo}-${siguiente}`;
}

export const ProductoService = {
  /* =====================================================
     Obtener todos los productos
  ====================================================== */
  async obtenerTodos(): Promise<Producto[]> {
    const { data, error } = await supabase.from(TABLA).select("*");

    if (error) throw new Error(error.message);
    return data as Producto[];
  },

  /* =====================================================
     Crear producto (codigoprod autogenerado)
  ====================================================== */
  async crear(
    producto: Omit<Producto, "idproducto" | "creado_en">
  ): Promise<Producto> {
    // Generar código automáticamente (ignora codigoprod que venga en el body)
    const codigoGenerado = await generarCodigoProducto({
      nombre: producto.nombre,
      idcategoria: producto.idcategoria,
      idmarca: producto.idmarca,
    });

    const payload: any = {
      codigoprod: codigoGenerado,             // ← aquí usamos el código generado
      urlimagen: producto.urlimagen ?? null,
      descripcion: producto.descripcion ?? "",
      estado: producto.estado ?? true,
      idcategoria: producto.idcategoria,
      idsubcategoria: producto.idsubcategoria,
      idmarca: producto.idmarca,
      nombre: producto.nombre,
      stock: producto.stock,
    };

    const { data, error } = await supabase
      .from(TABLA)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Producto;
  },

  /* =====================================================
     Actualizar producto
     (codigoprod INMODIFICABLE)
  ====================================================== */
  async actualizar(
    idproducto: string,
    producto: Partial<Producto>
  ): Promise<Producto> {
    const payload: any = {};

    // 🚫 NO permitir modificar el código
    if (producto.codigoprod !== undefined) {
      throw new Error("El código del producto (codigoprod) no se puede modificar.");
    }

    if (producto.urlimagen !== undefined)
      payload.urlimagen = producto.urlimagen;

    if (producto.descripcion !== undefined)
      payload.descripcion = producto.descripcion;

    if (producto.estado !== undefined)
      payload.estado = producto.estado;

    if (producto.idcategoria !== undefined)
      payload.idcategoria = producto.idcategoria;

    if (producto.idsubcategoria !== undefined)
      payload.idsubcategoria = producto.idsubcategoria;

    if (producto.idmarca !== undefined)
      payload.idmarca = producto.idmarca;

    if (producto.nombre !== undefined)
      payload.nombre = producto.nombre.toUpperCase().trim();

    if (producto.stock !== undefined)
      payload.stock = producto.stock;

    const { data, error } = await supabase
      .from(TABLA)
      .update(payload)
      .eq("idproducto", idproducto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Producto;
  },

  /* =====================================================
     Eliminar producto
  ====================================================== */
  async eliminar(idproducto: string): Promise<void> {
    const { error } = await supabase
      .from(TABLA)
      .delete()
      .eq("idproducto", idproducto);

    if (error) throw new Error(error.message);
  },

  /* =====================================================
     Cambiar estado boolean (activar/desactivar)
  ====================================================== */
  async cambiarEstado(
    idproducto: string,
    estado: boolean
  ): Promise<Producto> {
    const { data, error } = await supabase
      .from(TABLA)
      .update({ estado })
      .eq("idproducto", idproducto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Producto;
  },
};
