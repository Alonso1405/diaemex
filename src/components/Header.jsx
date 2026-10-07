import { empresa } from "../config/empresa";

function Header() {
    return (
        <header className="header">
            <div className="header-container">

                <a href="#" className="logo">
                    {empresa.nombre}
                </a>

                <nav className="nav">
                    <a href="#inicio">Inicio</a>
                    <a href="#nosotros">Nosotros</a>
                    <a href="#procesos">Procesos</a>
                    <a href="#catalogo">Catálogo</a>
                    <a href="#contacto">Contacto</a>
                </nav>

                <a
                    href={`https://wa.me/${empresa.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-button"
                >
                    💬 WhatsApp
                </a>

            </div>
        </header>
    );
}

export default Header;