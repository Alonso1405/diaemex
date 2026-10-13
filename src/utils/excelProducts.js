
import * as XLSX from "xlsx";

function obtenerValor(fila, columna) {
    const clave = Object.keys(fila).find(
        (k) => k.trim().toUpperCase() === columna.toUpperCase()
    );

    return clave ? fila[clave] : "";
}

export async function cargarProductosExcel() {
    const respuesta = await fetch("/catalogo.xlsx");

    if (!respuesta.ok) {
        throw new Error("No se encontró public/catalogo.xlsx");
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
            raw: false,
        });

        filas.forEach((fila) => {
            const sku = String(obtenerValor(fila, "SKU") ?? "").trim();
            const nombreExcel = String(
                obtenerValor(fila, "NOMBRE") ?? ""
            ).trim();

            const descripcionExcel = String(
                obtenerValor(fila, "DESCRIPCION") ?? ""
            ).trim();

            // Algunas hojas tienen NOMBRE y otras usan DESCRIPCION.
            const nombre = nombreExcel || descripcionExcel;

            if (!sku || !nombre) return;

            productos.push({
                sku,
                nombre,
                marca:
                    String(obtenerValor(fila, "MARCA") ?? "").trim() ||
                    nombreHoja,
                descripcion: nombreExcel ? descripcionExcel : "",
                precio: obtenerValor(fila, "PRECIO") || null,
            });
        });
    });

    return productos;
}
