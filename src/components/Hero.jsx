import { empresa } from "../config/empresa";

function Hero() {
    return (
        <section className="hero" id="inicio">
            <div className="hero-container">

                <div className="hero-content">

                    <span className="hero-tag">
                        SOLUCIONES PARA LA INDUSTRIA
                    </span>

                    <h1>
                        Materiales que impulsan
                        <span> tu industria</span>
                    </h1>

                    <p className="hero-experience">
                        {empresa.experiencia}
                    </p>

                    <p className="hero-description">
                        {empresa.descripcion}
                    </p>

                    <div className="hero-buttons">

                        <a href="#catalogo" className="btn-primary">
                            Ver catálogo
                        </a>

                        <a
                            href={`https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(
                                "Hola, me gustaría solicitar información sobre los productos de DIAEMEX."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp"
                        >
                            💬 Solicitar información
                        </a>

                    </div>

                </div>

                <div className="hero-image">
                    <div className="hero-circle">
                        ⚡
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Hero;