/* Entradas suaves al hacer scroll.
   Si el navegador pide menos movimiento o no hay IntersectionObserver,
   el script no hace nada y todo queda visible: nunca se esconde contenido. */
(function () {
    var raiz = document.documentElement;
    var prefiereQuieto = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefiereQuieto.matches || !('IntersectionObserver' in window)) return;

    raiz.classList.add('con-movimiento');

    var paso = function (grupo) {
        var salto = parseInt(grupo.getAttribute('data-stagger'), 10) || 80;
        Array.prototype.forEach.call(grupo.children, function (hijo, i) {
            hijo.style.setProperty('--enter-delay', (i * salto) + 'ms');
        });
    };

    document.querySelectorAll('[data-stagger]').forEach(paso);

    var objetivos = document.querySelectorAll('[data-reveal], [data-stagger] > *');

    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (!entrada.isIntersecting) return;
            entrada.target.classList.add('visible');
            observador.unobserve(entrada.target);
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    // lo que ya se ve al cargar entra enseguida, sin esperar el scroll
    var alto = window.innerHeight;
    objetivos.forEach(function (el) {
        var caja = el.getBoundingClientRect();
        if (caja.top < alto * 0.92 && caja.bottom > 0) {
            el.classList.add('visible');
        } else {
            observador.observe(el);
        }
    });
})();
