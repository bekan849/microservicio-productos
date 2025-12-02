export interface Vehiculo {
  idvehiculo: string;
  codigovehic: string;
  urlImagen?: string;
  descripcion?: string;
  estado: boolean;
  idCategoria: string;
  idSubcategoria: string;
  idMarca: string;
  nombre: string;
  stock: number;
  creado_en?: string;
}
