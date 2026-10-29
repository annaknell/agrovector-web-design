/* Formulario de contacto: valida en el navegador y arma la consulta en WhatsApp.
   Sin backend: el mensaje se abre listo para enviar desde el WhatsApp del visitante. */
(function () {
    var form = document.getElementById('form-contacto');
    if (!form) return;

    var okBox = form.querySelector('[data-form-ok]');
    var errBox = form.querySelector('[data-form-error]');
    var requeridos = ['nombre', 'localidad', 'telefono', 'linea'];
    var NUMERO = '5492494514837';

    function marcar(el, mal) {
        el.setAttribute('aria-invalid', mal ? 'true' : 'false');
    }

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        errBox.hidden = true;
        okBox.hidden = true;

        var datos = {};
        var falta = null;

        requeridos.forEach(function (nombre) {
            var el = form.elements[nombre];
            var vacio = !el.value.trim();
            marcar(el, vacio);
            if (vacio && !falta) falta = el;
            datos[nombre] = el.value.trim();
        });

        datos.mensaje = form.elements.mensaje.value.trim();

        if (falta) {
            var etiqueta = falta.labels && falta.labels[0] ? falta.labels[0].textContent.trim() : 'los datos';
            errBox.textContent = 'Falta completar ' + etiqueta.toLowerCase() + '.';
            errBox.hidden = false;
            falta.focus();
            return;
        }

        var texto = [
            'Consulta desde la web',
            'Nombre: ' + datos.nombre,
            'Localidad: ' + datos.localidad,
            'Teléfono: ' + datos.telefono,
            'Línea: ' + datos.linea,
            datos.mensaje ? 'Consulta: ' + datos.mensaje : ''
        ].filter(Boolean).join('\n');

        window.open('https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');

        okBox.hidden = false;
        form.reset();
        requeridos.forEach(function (nombre) { marcar(form.elements[nombre], false); });
    });

    form.addEventListener('input', function (evento) {
        var el = evento.target;
        if (el.getAttribute && el.getAttribute('aria-invalid') === 'true' && el.value.trim()) {
            marcar(el, false);
        }
    });
})();
