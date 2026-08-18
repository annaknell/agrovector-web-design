document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.getElementById('preloader');
    if (preloader) {
        const quitarPreloader = () => {
            preloader.classList.add('oculto');
            document.body.classList.add('cargado');
            setTimeout(() => preloader.remove(), 700);
        };
        const inicio = performance.now();
        const alCargar = () => {
            const transcurrido = performance.now() - inicio;
            setTimeout(quitarPreloader, Math.max(0, 1100 - transcurrido));
        };
        if (document.readyState === 'complete') {
            alCargar();
        } else {
            window.addEventListener('load', alCargar, { once: true });
        }
        // Red de seguridad: si la carga se traba, el preloader sale igual a los 4s
        setTimeout(quitarPreloader, 4000);
    }

    // ==========================
    // 1. SWIPERS (Carruseles)
    // ==========================
    const carrouselContainer = document.querySelector('.carrousel-img-container');
    if (carrouselContainer) {
        const swiper = new Swiper('.carrousel-img-container', {
            slidesPerView: 1,
            spaceBetween: 12,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    const productosGrid = document.querySelector('.productos-grid');
    if (productosGrid) {
        const swiperProductos = new Swiper('.productos-grid', {
            slidesPerView: 1.4,
            spaceBetween: 12,
            grabCursor: true,
            centerInsufficientSlides: true,
            breakpoints: {
                768: { slidesPerView: 3, spaceBetween: 20 },
            },
        });
    }

    // ===========================
    // 2. MENÚ DESPLEGABLE MÓVIL 
    // ===========================
    const botonMenu = document.querySelector('.menu-desplegable');
    const menuLinks = document.querySelector('.nav-links'); 
    const botonCerrar = document.querySelector('.menu-cerrar');

    if (botonMenu && menuLinks) {
        botonMenu.addEventListener('click', function(){
            menuLinks.classList.toggle('activo');
        });
    }

    if (botonCerrar && menuLinks) {
        botonCerrar.addEventListener('click', function(){
            menuLinks.classList.remove('activo');
        });
    }

    // =========================
    // 3. SUBMENÚ DE PRODUCTOS
    // =========================
    const linkToggle = document.querySelector('.link-toggle');
    const itemSubMenu = document.querySelector('.item-submenu');
    const todosLosLinks = document.querySelectorAll('.nav-links a');

    if (linkToggle && itemSubMenu) {
        linkToggle.addEventListener('click', function(e) {
            if (window.innerWidth < 1024) {
                e.preventDefault(); 
                itemSubMenu.classList.toggle('abierto'); 
            }
        });
    }

    todosLosLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!e.target.classList.contains('link-toggle')) {
                if (menuLinks) menuLinks.classList.remove('activo'); 
                if (itemSubMenu) itemSubMenu.classList.remove('abierto'); 
            }
        });
    });

    // ==========================================
    // 4. HEADER INTELIGENTE (Ocultar al scrollear)
    // ==========================================
    let ubicacionActual = window.scrollY;
    const header = document.querySelector('header');

    if (header) {
        // rAF throttle: el handler corre como máximo 1 vez por frame
        // (el comportamiento es idéntico, pero sin trabajo innecesario).
        let enEsperaDeFrame = false;
        const manejarScroll = function () {
            enEsperaDeFrame = false;
            const desplazamientoActual = window.scrollY;

            if (desplazamientoActual > 50 && menuLinks && menuLinks.classList.contains('activo')) {
                menuLinks.classList.remove('activo');
                if (itemSubMenu) itemSubMenu.classList.remove('abierto');
                if (botonMenu) botonMenu.setAttribute('aria-expanded', 'false');
            }

            if (desplazamientoActual <= 100) {
                header.classList.remove('hidden-header');
                ubicacionActual = desplazamientoActual;
                return;
            }

            if (ubicacionActual >= desplazamientoActual) {
                header.classList.remove('hidden-header');
            } else {
                header.classList.add('hidden-header');
            }
            ubicacionActual = desplazamientoActual;
        };

        window.addEventListener('scroll', function () {
            if (enEsperaDeFrame) return;
            enEsperaDeFrame = true;
            requestAnimationFrame(manejarScroll);
        }, { passive: true });
    }

    // ==========================================
    // 5. INTERACCIONES DE IMÁGENES (Sección 3)
    // ==========================================
    const listItems = document.querySelectorAll('.list-item');
    const images = document.querySelectorAll('.showcase-img');

    if (listItems.length > 0 && images.length > 0) {
        let indexActualInteractivo = 0; 
        let intervaloInteractivo; 

        function changeImage(index) {
            images.forEach(img => img.classList.remove('active'));
            
            const targetImage = document.getElementById('img-' + index);
            if (targetImage) {
                targetImage.classList.add('active');
            }
            
            listItems.forEach((item, i) => {
                if(i == parseInt(index)) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            
            indexActualInteractivo = parseInt(index);
        }

   
        function iniciarAutoPlayInteractivo() {
            intervaloInteractivo = setInterval(() => {
               
                
                    indexActualInteractivo++;
                    
                   
                    if (indexActualInteractivo >= listItems.length) {
                        indexActualInteractivo = 0;
                    }
                    
                    changeImage(indexActualInteractivo);
                
            }, 10000); 
        }

        
        function reiniciarAutoPlayInteractivo() {
            clearInterval(intervaloInteractivo);
            iniciarAutoPlayInteractivo();
        }

        listItems.forEach((item) => {
            const index = item.getAttribute('data-index');

            item.addEventListener('mouseenter', () => {
                changeImage(index);
                reiniciarAutoPlayInteractivo(); 
            });

            item.addEventListener('click', () => {
                changeImage(index);
                reiniciarAutoPlayInteractivo();
            });
        });

    
        iniciarAutoPlayInteractivo();
    }

    // =========================
    // 6. SLIDER DE SERVICIOS 
    // =========================
    const tarjetasServicios = document.querySelectorAll('.card-servicio');
    const dotsServicios = document.querySelectorAll('.dot');
    
    if (tarjetasServicios.length > 0) {
        const totalTarjetas = tarjetasServicios.length; 
        let indexActualServ = 0;
        let intervaloAutoPlayServ;

        function actualizarSliderServ() {
            tarjetasServicios.forEach((tarjeta, index) => {
                if (index === indexActualServ) {
                    tarjeta.classList.add('active-card');
                } else {
                    tarjeta.classList.remove('active-card');
                }
            });

            dotsServicios.forEach((dot, index) => {
                if (index === indexActualServ) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        window.moverSlider = function(direccion) {
            indexActualServ += direccion;
            
            if (indexActualServ < 0) {
                indexActualServ = totalTarjetas - 1;
            } else if (indexActualServ >= totalTarjetas) {
                indexActualServ = 0;
            }
            
            actualizarSliderServ();
            reiniciarAutoPlayServ(); 
        }

       
        const btnPrev = document.querySelector('.btn-prev');
        const btnNext = document.querySelector('.btn-next');
        if (btnPrev) btnPrev.addEventListener('click', () => window.moverSlider(-1));
        if (btnNext) btnNext.addEventListener('click', () => window.moverSlider(1));

        function iniciarAutoPlayServ() {
            intervaloAutoPlayServ = setInterval(() => {
                if (window.innerWidth <= 1023) {
                    window.moverSlider(1);
                }
            }, 4000); 
        }

        function reiniciarAutoPlayServ() {
            clearInterval(intervaloAutoPlayServ);
            iniciarAutoPlayServ();
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1023) {
                indexActualServ = 0; 
            }
            actualizarSliderServ();
        });

        iniciarAutoPlayServ();
    }

        // ==============================
        // CONTADORES ANIMADOS (estadísticas)
        // ==============================
        const contadores = document.querySelectorAll('.stat-numero');
        if (contadores.length && 'IntersectionObserver' in window) {
            const animarContador = (el) => {
                const objetivo = Number(el.dataset.contador) || 0;
                const prefijo = el.dataset.prefijo || '';
                const sufijo = el.dataset.sufijo || '';
                const duracion = 1600;
                const inicio = performance.now();
                const formato = (n) => n.toLocaleString('es-AR');
                const paso = (ahora) => {
                    const progreso = Math.min((ahora - inicio) / duracion, 1);
                    // easing: suaviza el final
                    const eased = 1 - Math.pow(1 - progreso, 3);
                    el.textContent = prefijo + formato(Math.round(objetivo * eased)) + sufijo;
                    if (progreso < 1) requestAnimationFrame(paso);
                };
                requestAnimationFrame(paso);
            };
            const obsContadores = new IntersectionObserver((entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        animarContador(entrada.target);
                        obsContadores.unobserve(entrada.target);
                    }
                });
            }, { threshold: 0.4 });
            contadores.forEach((c) => obsContadores.observe(c));
        } else {
            contadores.forEach((c) => {
                c.textContent = (c.dataset.prefijo || '') + (Number(c.dataset.contador) || 0).toLocaleString('es-AR') + (c.dataset.sufijo || '');
            });
        }

        // ==============================
        // BOTÓN VOLVER ARRIBA
        // ==============================
        const botonArriba = document.getElementById('volver-arriba');
        if (botonArriba) {
            botonArriba.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            let esperaFrameBoton = false;
            const alDesplazarBoton = () => {
                esperaFrameBoton = false;
                botonArriba.classList.toggle('visible', window.scrollY > 500);
            };
            window.addEventListener('scroll', () => {
                if (esperaFrameBoton) return;
                esperaFrameBoton = true;
                requestAnimationFrame(alDesplazarBoton);
            }, { passive: true });
            alDesplazarBoton();
        }

        const itemsLista = document.querySelectorAll('.list-item');
        const tituloShow = document.getElementById('showcase-titulo');
        const capWrap = document.querySelector('.showcase-caption');
        if (itemsLista.length && tituloShow) {
            const actualizarLeyenda = (item) => {
                const t = item.querySelector('h3');
                if (t) tituloShow.textContent = t.textContent.replace(/^\d+\.\s*/, '').trim();
                if (capWrap) capWrap.classList.add('visible');
            };
            itemsLista.forEach((item) => {
                item.addEventListener('mouseenter', () => actualizarLeyenda(item));
                item.addEventListener('click', () => actualizarLeyenda(item));
            });
           
            const itemActivo = document.querySelector('.list-item.active');
            if (itemActivo) actualizarLeyenda(itemActivo);
        }

        const barraProgreso = document.getElementById('barra-progreso');
        if (barraProgreso) {
            const alProgresar = () => {
                const alto = document.documentElement.scrollHeight - window.innerHeight;
                barraProgreso.style.width = (alto > 0 ? Math.min((window.scrollY / alto) * 100, 100) : 0) + '%';
            };
            window.addEventListener('scroll', alProgresar, { passive: true });
            alProgresar();
        }

        const seccionesReveal = document.querySelectorAll(
            '.stats-section, .capacitaciones-container, .interactive-container, .interactiva-header, .servicios-wrapper, .products-container, .contacto-wrapper'
        );
        if ('IntersectionObserver' in window && seccionesReveal.length) {
            seccionesReveal.forEach((el) => el.classList.add('reveal'));
            const observadorReveal = new IntersectionObserver((entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add('visible');
                        observadorReveal.unobserve(entrada.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
            seccionesReveal.forEach((el) => observadorReveal.observe(el));
        }
});
/* Favicon adaptativo */
document.addEventListener('DOMContentLoaded', () => {
    const tarjeta = document.querySelector('.card-contacto');
    if (!tarjeta) return;
    const envoltorio = tarjeta.closest('.contacto-wrapper');
    if (!('IntersectionObserver' in window) || !window.matchMedia ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    envoltorio.classList.add('contacto-anim');
    const observador = new IntersectionObserver((entries) => {
        entries.forEach((entrada) => {
            if (entrada.isIntersecting) {
                tarjeta.classList.add('visible');
                observador.disconnect();
            }
        });
    }, { threshold: 0.25 });
    observador.observe(tarjeta);
});
