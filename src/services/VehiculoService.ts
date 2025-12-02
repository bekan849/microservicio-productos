// src/services/VehiculoService.ts
import { supabase } from "../config/supabaseClient";
import { Vehiculo } from "../models/Vehiculo";

const TABLA = "vehiculos";

export const VehiculoService = {
  async obtenerTodos(): Promise<Vehiculo[]> {
    const { data, error } = await supabase.from(TABLA).select("*");
    if (error) throw new Error(error.message);

    // 🔄 Asegurar que estado sea booleano
    return (data || []).map((v: any) => ({
      ...v,
      estado: v.estado === true || v.estado === "true", // por si viniera string
    })) as Vehiculo[];
  },

  async crear(vehiculo: Omit<Vehiculo, "idVehiculo" | "creado_en">): Promise<Vehiculo> {
    vehiculo.estado = !!vehiculo.estado; // 🔄 convertir a boolean
    const { data, error } = await supabase.from(TABLA).insert([vehiculo]).select().single();
    if (error) throw new Error(error.message);
    return data as Vehiculo;
  },

  async actualizar(idVehiculo: string, vehiculo: Partial<Vehiculo>): Promise<Vehiculo> {
    if (vehiculo.estado !== undefined) {
      vehiculo.estado = !!vehiculo.estado; // 🔄 convertir a boolean
    }

    const { data, error } = await supabase
      .from(TABLA)
      .update(vehiculo)
      .eq("idVehiculo", idVehiculo)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Vehiculo;
  },

  async eliminar(idVehiculo: string): Promise<void> {
    const { error } = await supabase.from(TABLA).delete().eq("idVehiculo", idVehiculo);
    if (error) throw new Error(error.message);
  },
};
