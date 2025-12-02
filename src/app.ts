import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productoRoutes from "./routes/producto.routes";
import vehiculoRoutes from "./routes/vehiculo.routes";
import marcaRoutes from "./routes/marca.routes";
import categoriaRoutes from "./routes/categoria.routes";
import subcategoriaRoutes from "./routes/subcategoria.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/productos", productoRoutes);
app.use("/api/vehiculos", vehiculoRoutes);
app.use("/api/marcas", marcaRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/subcategorias", subcategoriaRoutes);

export default app;
