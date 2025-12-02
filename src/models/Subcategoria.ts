export interface Subcategoria {
  idSubcategoria: string;
  nombre: string;
  descripcion?: string;
  categoriaid: string; // relación con Categoria
  estado: boolean;
  creadoEn?: string; // o Timestamp si usas Firestore
}
