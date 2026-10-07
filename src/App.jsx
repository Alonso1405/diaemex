import { useEffect, useState } from "react";
import { cargarProductosExcel } from "./utils/excelProducts";
import { empresa } from "./config/empresa";
import "./index.css";


function App() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [marca, setMarca] = useState("Todas");
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarProductosExcel()
      .then((datos) => setProductos(datos))
      .catch(() => setError("No se pudo cargar el catálogo."))
      .finally(() => setCargando(false));
  }, []);

  const marcas = ["Todas", ...new Set(productos.map((p) => p.marca))];

  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(texto) ||
      producto.sku.toLowerCase().includes(texto) ||
      producto.descripcion.toLowerCase().includes(texto);

    const coincideMarca =
      marca === "Todas" || producto.marca === marca;

    return coincideBusqueda && coincideMarca;
  });

  function agregarProducto(producto) {
    if (!seleccionados.some((p) => p.sku === producto.sku)) {
      setSeleccionados([...seleccionados, producto]);
    }
  }

  function quitarProducto(sku) {
    setSeleccionados(
      seleccionados.filter((producto) => producto.sku !== sku)
    );
  }

  function solicitarWhatsApp() {
    if (seleccionados.length === 0) {
      alert("Agrega al menos un producto a la solicitud.");
      return;
    }

    const productosTexto = seleccionados
      .map(
        (producto, index) =>
          `${index + 1}. ${producto.nombre}\n   SKU: ${producto.sku}\n   Marca: ${producto.marca}`
      )
      .join("\n\n");

    const mensaje = encodeURIComponent(
      `Hola, DIAEMEX.

Me gustaría solicitar información y cotización de los siguientes productos:

${productosTexto}

Favor de proporcionarme precio y disponibilidad.

Gracias.`
    );

    const url = `https://wa.me/${empresa.whatsapp}?text=${mensaje}`;

    window.open(url, "_blank");
  }

  if (cargando) {
    return <div className="loading">Cargando catálogo DIAEMEX...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">

      <header className="header">
        <div className="header-container">

          <div className="logo">
            <img src="/logo-diaemex.png" alt="DIAEMEX" />
          </div>

          <nav>
            <a href="#inicio">Inicio</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <button
            className="whatsapp-top"
            onClick={() => {
              const mensaje = encodeURIComponent(
                "Hola, me gustaría solicitar información sobre los productos de DIAEMEX."
              );

              window.open(
                `https://wa.me/${empresa.whatsapp}?text=${mensaje}`,
                "_blank"
              );
            }}
          >
            💬 WhatsApp
          </button>

        </div>
      </header>

      <section className="hero" id="inicio">
        <div>
          <span className="hero-tag">
            SOLUCIONES PARA LA INDUSTRIA
          </span>

          <h1>
            Materiales que impulsan
            <br />
            tu industria
          </h1>

          <p>
            Equipos, consumibles, refacciones y soluciones
            profesionales para soldadura y corte.
          </p>

          <a href="#catalogo" className="hero-button">
            Ver catálogo
          </a>
        </div>
      </section>

      <main id="catalogo" className="catalogo">

        <div className="catalogo-titulo">
          <div>
            <span className="section-tag">CATÁLOGO</span>
            <h2>Productos DIAEMEX</h2>
            <p>
              {productos.length} productos disponibles
            </p>
          </div>

          {seleccionados.length > 0 && (
            <button
              className="solicitud-button"
              onClick={solicitarWhatsApp}
            >
              📲 Solicitar información ({seleccionados.length})
            </button>
          )}
        </div>

        <div className="filtros">

          <input
            type="text"
            placeholder="🔎 Buscar por producto, SKU o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          >
            {marcas.map((nombreMarca) => (
              <option key={nombreMarca} value={nombreMarca}>
                {nombreMarca}
              </option>
            ))}
          </select>

        </div>

        <div className="resultados">
          Mostrando <strong>{productosFiltrados.length}</strong> productos
        </div>

        <div className="productos-grid">

          {productosFiltrados.map((producto) => {

            const seleccionado = seleccionados.some(
              (p) => p.sku === producto.sku
            );

            return (
              <article className="producto-card" key={producto.sku}>

                <div className="producto-imagen">
                  <img
                    src={`/productos/${producto.sku}.jpg`}
                    alt={producto.nombre}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/productos/default.jpg";
                    }}
                  />
                </div>

                <div className="producto-marca">
                  {producto.marca}
                </div>

                <h3>{producto.nombre}</h3>

                <div className="sku">
                  SKU: {producto.sku}
                </div>

                <p>{producto.descripcion}</p>

                <button
                  className={
                    seleccionado
                      ? "producto-button seleccionado"
                      : "producto-button"
                  }
                  onClick={() =>
                    seleccionado
                      ? quitarProducto(producto.sku)
                      : agregarProducto(producto)
                  }
                >
                  {seleccionado
                    ? "✓ Agregado"
                    : "＋ Agregar a solicitud"}
                </button>

              </article>
            );
          })}

        </div>

      </main>

      {seleccionados.length > 0 && (
        <div className="solicitud-flotante">
          <div className="solicitud-info">
            <strong>
              📋 {seleccionados.length} producto
              {seleccionados.length !== 1 ? "s" : ""} seleccionado
              {seleccionados.length !== 1 ? "s" : ""}
            </strong>

            <span>
              Tu solicitud está lista para enviar
            </span>
          </div>

          <button
            className="solicitud-whatsapp"
            onClick={solicitarWhatsApp}
          >
            💬 Enviar solicitud por WhatsApp
          </button>
        </div>
      )}

      <footer id="contacto">
        <h3>DIAEMEX</h3>
        <p>
          Distribuidora de Aleaciones y Equipos Mexicanos, S.A. de C.V.
        </p>
        <p>Más de 30 años de experiencia en el mercado nacional.</p>
      </footer>

    </div>
  );
}

export default App;