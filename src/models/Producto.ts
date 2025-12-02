export interface Producto {
  idproducto: string;
  codigoprod: string;
  urlimagen?: string;
  descripcion?: string;
  estado: boolean;
  idcategoria: string;
  idsubcategoria: string;
  idmarca: string;
  nombre: string;
  stock: number;
  creado_en?: string;
}
