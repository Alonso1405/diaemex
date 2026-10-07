import * as XLSX from "xlsx";

export async function cargarProductosExcel() {
    try {
        const respuesta = await fetch("/catalogo.xlsx");

        if (!respuesta.ok) {
            throw new Error(
                `No se pudo cargar catalogo.xlsx. Código: ${respuesta.status}`
            );
        }

        const datos = await respuesta.arrayBuffer();

        const libro = XLSX.read(datos, {
            type: "array",
        });

        const productos = [];

        libro.SheetNames.forEach((nombreHoja) => {
            const hoja = libro.Sheets[nombreHoja];

            if (!hoja) return;

            const filas = XLSX.utils.sheet_to_json(hoja, {
                defval: "",
            });

            filas.forEach((fila) => {
                productos.push({
                    sku: String(fila.SKU ?? "").trim(),
                    nombre: String(fila.NOMBRE ?? "").trim(),
                    marca: String(fila.MARCA ?? nombreHoja ?? "").trim(),
                    descripcion: String(fila.DESCRIPCION ?? "").trim(),
                    precio: fila.PRECIO ?? "",
                });
            });
        });

        console.log("Catálogo cargado correctamente:", productos.length);
        console.log("Hojas encontradas:", libro.SheetNames);

        return productos;
    } catch (error) {
        console.error("Error al leer el catálogo:", error);
        throw error;
    }
}