// src/services/VehiculoService.ts
import { supabase } from "../config/supabaseClient";
import { Vehiculo } from "../models/Vehiculo";

const TABLA = "vehiculos";

/* =====================================================
   Helper: generar prefijo (NOMBRE + CATEGORÍA + MARCA)
===================================================== */
async function generarCodigoVehiculo(
  nombre: string,
  idcategoria: string,
  idmarca: string
): Promise<string> {
  // 1. Obtener nombres de categoría y marca (para el prefijo)
  const [catRes, marcaRes] = await Promise.all([
    supabase
      .from("categorias")
      .select("nombre")
      .eq("idcategoria", idcategoria)
      .single(),
    supabase.from("marcas").select("nombre").eq("idmarca", idmarca).single(),
  ]);

  const nombreVeh = (nombre || "").toUpperCase().trim();
  const nombreCat = (catRes.data?.nombre || "").toUpperCase().trim();
  const nombreMarca = (marcaRes.data?.nombre || "").toUpperCase().trim();

  // 2 letras de cada uno (si existen)
  const preNombre = nombreVeh.substring(0, 2);
  const preCat = nombreCat.substring(0, 2);
  const preMarca = nombreMarca.substring(0, 2);

  // Prefijo base tipo TAANMA
  const base =
    `${preNombre}${preCat}${preMarca}`.replace(/[^A-Z0-9]/g, "") || "VH";

  // 2. Buscar códigos existentes que empiecen con ese prefijo
  const { data: existentes, error } = await supabase
    .from(TABLA)
    .select("codigovehic")
    .ilike("codigovehic", `${base}-%`);

  if (error) {
    throw new Error(error.message);
  }

  // 3. Obtener el mayor sufijo numérico
  let maxNumero = 0;

  (existentes || []).forEach((row: any) => {
    const cod: string = row.codigovehic || "";
    const partes = cod.split("-");
    const numStr = partes[1];
    const num = parseInt(numStr, 10);
    if (!isNaN(num) && num > maxNumero) {
      maxNumero = num;
    }
  });

  const siguiente = maxNumero + 1;

  // Resultado final: TAANMA-1, TAANMA-2, etc.
  return `${base}-${siguiente}`;
}

/* =====================================================
   Servicio Vehiculo
===================================================== */
export const VehiculoService = {
  /* =====================================================
     Obtener todos los vehículos
  ====================================================== */
  async obtenerTodos(): Promise<Vehiculo[]> {
    const { data, error } = await supabase.from(TABLA).select("*");
    if (error) throw new Error(error.message);

    // 🔄 Asegurar que estado sea booleano
    return (data || []).map((v: any) => ({
      ...v,
      estado: v.estado === true || v.estado === "true",
    })) as Vehiculo[];
  },

  /* =====================================================
     Crear vehículo
     - codigovehic se AUTOGENERA
  ====================================================== */
  async crear(
    vehiculo: Omit<Vehiculo, "idvehiculo" | "creado_en">
  ): Promise<Vehiculo> {
    // Normalizar nombre aquí por si acaso
    const nombreNormalizado = vehiculo.nombre.toUpperCase().trim();

    // Asegurar boolean
    const estado = vehiculo.estado ?? true;

    // Generar código único
    const codigovehic = await generarCodigoVehiculo(
      nombreNormalizado,
      vehiculo.idcategoria,
      vehiculo.idmarca
    );

    const payload: any = {
      // NO enviamos idvehiculo, lo genera la DB
      codigovehic,
      urlimagen: vehiculo.urlimagen ?? null,
      descripcion: vehiculo.descripcion ?? "",
      estado,
      idcategoria: vehiculo.idcategoria,
      idsubcategoria: vehiculo.idsubcategoria,
      idmarca: vehiculo.idmarca,
      nombre: nombreNormalizado,
      stock: vehiculo.stock,
    };

    const { data, error } = await supabase
      .from(TABLA)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Vehiculo;
  },

  /* =====================================================
     Actualizar vehículo
     - codigovehic ES INMODIFICABLE (no se toca)
  ====================================================== */
  async actualizar(
    idvehiculo: string,
    vehiculo: Partial<Vehiculo>
  ): Promise<Vehiculo> {
    const payload: any = {};

    if (vehiculo.urlimagen !== undefined) payload.urlimagen = vehiculo.urlimagen;
    if (vehiculo.descripcion !== undefined)
      payload.descripcion = vehiculo.descripcion;
    if (vehiculo.estado !== undefined) payload.estado = !!vehiculo.estado;
    if (vehiculo.idcategoria !== undefined)
      payload.idcategoria = vehiculo.idcategoria;
    if (vehiculo.idsubcategoria !== undefined)
      payload.idsubcategoria = vehiculo.idsubcategoria;
    if (vehiculo.idmarca !== undefined) payload.idmarca = vehiculo.idmarca;
    if (vehiculo.nombre !== undefined)
      payload.nombre = vehiculo.nombre.toUpperCase().trim();
    if (vehiculo.stock !== undefined) payload.stock = vehiculo.stock;

    // ⚠️ IMPORTANTE: NO incluimos codigovehic en payload

    const { data, error } = await supabase
      .from(TABLA)
      .update(payload)
      .eq("idvehiculo", idvehiculo)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Vehiculo;
  },

  /* =====================================================
     Eliminar vehículo
  ====================================================== */
  async eliminar(idvehiculo: string): Promise<void> {
    const { error } = await supabase
      .from(TABLA)
      .delete()
      .eq("idvehiculo", idvehiculo);

    if (error) throw new Error(error.message);
  },

  /* =====================================================
     Cambiar estado (activar / desactivar)
  ====================================================== */
  async cambiarEstado(
    idvehiculo: string,
    estado: boolean
  ): Promise<Vehiculo> {
    const { data, error } = await supabase
      .from(TABLA)
      .update({ estado })
      .eq("idvehiculo", idvehiculo)
      .select()
      .single();

    if (error) throw new Error(error.message);
    // normalizamos por si el motor devolviera string
    return {
      ...(data as Vehiculo),
      estado: (data as any).estado === true || (data as any).estado === "true",
    };
  },
};
