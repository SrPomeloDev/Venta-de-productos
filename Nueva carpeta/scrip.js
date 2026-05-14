
// INTERACTIVIDAD DE LOS PERFILES
const perfiles = document.querySelectorAll('details');

perfiles.forEach(perfil => {
    perfil.addEventListener('toggle',() => {
        if(perfil.open){

            perfiles.forEach((OtroPerfil) => {
                if(OtroPerfil !== perfil){
                    OtroPerfil.removeAttribute('open');
                }
            });
            console.log("perfil abierto");

            setTimeout(() => {
                perfil.scrollIntoView({behavior: 'smooth', block: 'start'});
                }, 300);
            }
        });
    });
    

function modoPag(){
    document.body.classList.toggle('oscuro');

    const modo = document.getElementById('btn-modo');

    if(document.body.classList.contains('oscuro')){
        modo.textContent = 'Modo Claro';
        console.log("modo oscuro activado");
    } else {
        modo.textContent = 'Modo Oscuro';
        console.log("modo claro activado");
    }
}

const buscador = document.getElementById('buscador');
const tarjetas = document.querySelectorAll('.contenedor-padre > div');


buscador.addEventListener('input', e => {
    const textoBusqueda = e.target.value.toLowerCase().trim();

    tarjetas.forEach(tarjeta => {
        // Buscamos h1 y p específicamente
        const elementosTexto = tarjeta.querySelectorAll('h1, p');
        let coincidencia = false;

        elementosTexto.forEach(el => {
            // USAMOS textContent para capturar el texto aunque el details esté cerrado
            if (!el.getAttribute('data-original')) {
                el.setAttribute('data-original', el.textContent.trim());
            }

            const textoOriginal = el.getAttribute('data-original');

            if (textoBusqueda !== "" && textoOriginal.toLowerCase().includes(textoBusqueda)) {
                coincidencia = true;
                const regex = new RegExp(`(${textoBusqueda})`, 'gi');
                el.innerHTML = textoOriginal.replace(regex, `<mark>$1</mark>`);
            } else {
                el.innerHTML = textoOriginal;
            }
        });

        const details = tarjeta.querySelector('details');
        
        if (textoBusqueda === "") {
            // Si el buscador está vacío mostramos la pagina 
            tarjeta.classList.remove('filtros-ocultos');
        } else if (coincidencia) {
            // Si hay buscamos algo abre la tarjeta y muestra el resultado en azul css
            tarjeta.classList.remove('filtros-ocultos');
            details.open = true; 
        } else {
            // Si no hay coincidencia, ocultamos la tarjeta
            tarjeta.classList.add('filtros-ocultos');
            details.open = false;
        }
    });
});