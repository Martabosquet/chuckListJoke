const traerChiste = document.getElementById("fetchJoke");
const listaChistes = document.getElementById("jokeList");

//LOCALSTORAGE: CARGO EL ÚLTIMO CHISTE GUARDADO (SI HAY) CUANDO SE CARGUE LA PÁGINA:
    let chistesGuardados = JSON.parse(localStorage.getItem("misChistes")) || [];

    //CARGO LOS CHISTES GUARDADOS AL CARGAR LA PÁGINA DESDE LA ÚLTIMA SESIÓN:
        function cargarChistesIniciales() {
            chistesGuardados.forEach(chiste => {
                const tarjeta = crearTarjetaChiste(chiste);
                listaChistes.appendChild(tarjeta);
            });
        }
        cargarChistesIniciales();

// CREO LA ESTRUCTURA DE LA TARJETA EN UNA FUNCIÓN PARA REUTILIZARLA: CREARTARJETACHISTE
    function crearTarjetaChiste(textoChiste) {
        // Creo el contenedor de la tarjeta: <li>
        const tarjeta = document.createElement("li");
        tarjeta.classList.add("joke-card"); // Creo una clase para poder editar el estilo de la tarjeta en CSS

        // Creo el párrafo que contendrá el chiste + le añado una clase para poder editar su estilo en CSS
        const parrafoChiste = document.createElement("p");
        parrafoChiste.classList.add("joke-text");
        parrafoChiste.textContent = textoChiste; //le tengo que meter el texto del chiste dentro del párrafo

        // Creo el botón de eliminar, tb dentro del li, y le añado una clase para poder editar su estilo en CSS
        const botonEliminar = document.createElement("button");
        botonEliminar.classList.add("delete-btn");
        botonEliminar.textContent = "Eliminar"; //Es una cadena de texto estática (un string literal). Queremos que
        //ese botón diga siempre lo mismo, sin importar cuál sea el chiste. Por eso no hago referencia al textoChiste.

        //HAGO QUE CUANDO CLIQUE EN ELIMINAR, EL CHISTE SE BORRE:
        botonEliminar.addEventListener("click", () => {
            tarjeta.remove(); //elimino toda la tarjeta creada
            eliminarChisteDeStorage(textoChiste); //llamo a la función que elimina el chiste del localStorage, y le paso el texto del chiste para que sepa cuál eliminar
        });

        // Meto tanto el párrafo como el botón dentro del contenedor de la tarjeta (el <li>)
        tarjeta.appendChild(parrafoChiste);
        tarjeta.appendChild(botonEliminar);

        return tarjeta;
    }

// PREPARO LA FUNCIÓN PARA ELIMINAR EL CHISTE DEL LOCALSTORAGE CUANDO SE HAGA CLICK EN EL BOTÓN "ELIMINAR":
    function eliminarChisteDeStorage(textoParaBorrar) {
        let chistesEnStorage = JSON.parse(localStorage.getItem("misChistes")) || []; // Traemos lo que hay actualmente en el storage y lo convertimos a Array

        const nuevaLista = chistesEnStorage.filter(chiste => chiste !== textoParaBorrar); // Filtramos: "Quédate con todos los chistes EXCEPTO el que quiero borrar"

        localStorage.setItem("misChistes", JSON.stringify(nuevaLista)); // Guardamos la nueva lista (ya sin el chiste borrado) de vuelta en LocalStorage
    }


// PREPARO EL EVENTO PARA CUANDO SE HAGA CLICK EN EL BOTÓN "TRAER CHISTE":
    traerChiste.addEventListener("click", async () => { //mejor async porque vamos a hacer una petición a una API,
    // y eso es algo que tarda un poco, no es inmediato. Entonces, para no bloquear la ejecución del resto del
    // código mientras esperamos la respuesta de la API, usamos async/await.
        try {
            const respuesta = await fetch("https://api.chucknorris.io/jokes/random");
            const datos = await respuesta.json();
            const nuevoChiste = datos.value; //para el localStorage, guardo el chiste en una variable para no tener que escribir datos.value cada vez

            // Creamos la tarjeta usando nuestra función
            const nuevaTarjeta = crearTarjetaChiste(nuevoChiste);
            //guardo el chiste en localStorage para que se mantenga aunque recargue la página
            localStorage.setItem("ultimoChiste", nuevoChiste);

            // La añadimos al principio de la lista <ul>
            listaChistes.prepend(nuevaTarjeta);

            //GUARDAR EN EL ARRAY Y LUEGO A LOCALSTORAGE
            chistesGuardados.push(nuevoChiste);
            localStorage.setItem("misChistes", JSON.stringify(chistesGuardados));

        } catch (error) {
            console.error("No pudimos contactar con Chuck:", error);
        }
    });

// PREPARO EL EVENTO PARA CUANDO SE HAGA CLICK EN EL BOTÓN "ELIMINAR TODOS":
    const botonEliminarTodos = document.getElementById("deleteAll");
    botonEliminarTodos.addEventListener("click", () => {
        listaChistes.textContent = ""; //elimino todo el contenido de la lista (todas las tarjetas)
        localStorage.removeItem("misChistes"); //también borro el array del localStorage
    });