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
  const [eventoInstalacion, setEventoInstalacion] = useState(null);
  const [esIOS, setEsIOS] = useState(false);
  const [appInstalada, setAppInstalada] = useState(false);

  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1);

    const instalada =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setEsIOS(ios);
    setAppInstalada(instalada);

    const capturarInstalacion = (evento) => {
      evento.preventDefault();
      setEventoInstalacion(evento);
    };

    const instalacionCompletada = () => {
      setAppInstalada(true);
      setEventoInstalacion(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      capturarInstalacion
    );

    window.addEventListener(
      "appinstalled",
      instalacionCompletada
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        capturarInstalacion
      );

      window.removeEventListener(
        "appinstalled",
        instalacionCompletada
      );
    };
  }, []);

  useEffect(() => {
    cargarProductosExcel()
      .then((datos) => setProductos(datos))
      .catch(() => setError("No se pudo cargar el catálogo."))
      .finally(() => setCargando(false));
  }, []);

  const marcas = ["Todas", ...new Set(productos.map((p) => p.marca))];

  function normalizarTexto(texto) {
    return String(texto ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[-_/.,()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const productosFiltrados = productos.filter((producto) => {
    const textoBusqueda = normalizarTexto(busqueda);

    const contenidoProducto = normalizarTexto(
      [
        producto.sku,
        producto.nombre,
        producto.marca,
        producto.descripcion,
      ].join(" "),
    );

    const coincideBusqueda =
      textoBusqueda === "" ||
      textoBusqueda
        .split(" ")
        .filter(Boolean)
        .every((palabra) => contenidoProducto.includes(palabra));

    const coincideMarca =
      marca === "Todas" ||
      normalizarTexto(producto.marca) === normalizarTexto(marca);

    return coincideBusqueda && coincideMarca;
  });

  console.log("BUSQUEDA:", busqueda);
  console.log("PRODUCTOS FILTRADOS:", productosFiltrados);
  console.log(
    "SKUS FILTRADOS:",
    productosFiltrados.map((p) => p.sku),
  );

  function agregarProducto(producto) {
    if (!seleccionados.some((p) => p.sku === producto.sku)) {
      setSeleccionados([...seleccionados, producto]);
    }
  }

  function quitarProducto(sku) {
    setSeleccionados(seleccionados.filter((producto) => producto.sku !== sku));
  }

  function solicitarWhatsApp() {
    if (seleccionados.length === 0) {
      alert("Agrega al menos un producto a la solicitud.");
      return;
    }

    const productosTexto = seleccionados
      .map(
        (producto, index) =>
          `${index + 1}. ${producto.nombre}\n   SKU: ${producto.sku}\n   Marca: ${producto.marca}`,
      )
      .join("\n\n");

    const mensaje = encodeURIComponent(
      `Hola, DIAEMEX.

Me gustaría solicitar información y cotización de los siguientes productos:

${productosTexto}

Favor de proporcionarme precio y disponibilidad.

Gracias.`,
    );

    const url = `https://wa.me/${empresa.whatsapp}?text=${mensaje}`;

    window.open(url, "_blank");
  }

  async function instalarAplicacion() {
    if (eventoInstalacion) {
      eventoInstalacion.prompt();

      await eventoInstalacion.userChoice;

      setEventoInstalacion(null);
      return;
    }

    if (esIOS) {
      alert(
        'Para instalar DIAEMEX en tu iPhone:\n\n' +
        '1. Abre esta página en Safari.\n' +
        '2. Pulsa el botón Compartir.\n' +
        '3. Selecciona "Añadir a pantalla de inicio".\n' +
        '4. Pulsa "Añadir".'
      );
      return;
    }

    alert(
      'Para instalar DIAEMEX:\n\n' +
      'Abre el menú ⋮ de Chrome y selecciona ' +
      '"Instalar aplicación" o "Añadir a pantalla principal".'
    );
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

          {!appInstalada && (
            <button
              className="install-top"
              onClick={instalarAplicacion}
              type="button"
            >
              📲 Instalar DIAEMEX
            </button>
          )}

          <button
            className="whatsapp-top"
            onClick={() => {
              const mensaje = encodeURIComponent(
                "Hola, me gustaría solicitar información sobre los productos de DIAEMEX.",
              );

              window.open(
                `https://wa.me/${empresa.whatsapp}?text=${mensaje}`,
                "_blank",
              );
            }}
          >
            💬 WhatsApp
          </button>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div>
          <span className="hero-tag">SOLUCIONES PARA LA INDUSTRIA</span>

          <h1>
            Materiales que impulsan
            <br />
            tu industria
          </h1>

          <p>
            Equipos, consumibles, refacciones y soluciones profesionales para
            soldadura y corte.
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
            <p>{productos.length} productos disponibles</p>
          </div>

          {seleccionados.length > 0 && (
            <button className="solicitud-button" onClick={solicitarWhatsApp}>
              📲 Solicitar información ({seleccionados.length})
            </button>
          )}
        </div>

        <div className="filtros">
          <input
            type="text"
            placeholder="🔎 Buscar por producto, SKU, marca o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select value={marca} onChange={(e) => setMarca(e.target.value)}>
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
          {productosFiltrados.length === 0 ? (
            <div className="sin-resultados">
              <h3>No encontramos productos</h3>
              <p>
                No hay productos que coincidan con <strong>"{busqueda}"</strong>
                .
              </p>

              <button
                onClick={() => setBusqueda("")}
                className="limpiar-busqueda"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            productosFiltrados.map((producto, index) => {
              const seleccionado = seleccionados.some(
                (p) => p.sku === producto.sku,
              );

              return (
                <article
                  className="producto-card"
                  key={`${producto.sku}-${producto.marca}-${index}`}
                >
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

                  <div className="producto-marca">{producto.marca}</div>

                  <h3>{producto.nombre}</h3>

                  <div className="sku">SKU: {producto.sku}</div>

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
                    {seleccionado ? "✓ Agregado" : "＋ Agregar a solicitud"}
                  </button>
                </article>
              );
            })
          )}
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

            <span>Tu solicitud está lista para enviar</span>
          </div>

          <button className="solicitud-whatsapp" onClick={solicitarWhatsApp}>
            💬 Enviar solicitud por WhatsApp
          </button>
        </div>
      )}

      <footer id="contacto" className="footer-imagen">
        <img
          src="/footer-diaemex.png"
          alt="DIAEMEX - Soluciones para la industria"
        />
      </footer>
    </div>
  );
}

export default App;
