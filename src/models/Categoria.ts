export interface Categoria {
  idcategoria: string;   // ← corregido para coincidir con tu base de datos
  nombre: string;
  estado: boolean;
  descripcion?: string;
  creado_en?: string;
}
