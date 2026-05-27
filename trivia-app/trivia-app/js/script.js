async function cargarUsuarios() {
    const response = await fetch('./users.json');
    const users = await response.json();
    users.forEach(user => { console.log(user.nombre) })
    users.forEach(user => { localStorage.setItem(user.nombre, [user.rol,user.avatar]) })
}

// cargarUsuarios();

class InputName extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
        <style>
            *,
            *::before,
            *::after {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :root {
                --font-size-custom: 20px;
            }

            .input-container {
                display: flex;
                flex-direction: row;
                width: fit-content;
                height: fit-content;
                overflow: hidden;
                border: 2px solid rgb(46, 64, 87);
                border-radius: 9px;
                padding: 3px;
                background: rgb(91, 128, 177);
            }

            .lblName {
                color: rgb(46, 64, 87);
                font-size: var(--font-size-custom);
                font-family: "Arial";
                user-select: none;   /* evita que se seleccione el texto */
            }

            .inputName {
                border: 1px solid rgb(46, 64, 87);
                border-radius: 6px;
                font-size: var(--font-size-custom);
                font-family: "Arial";
            }

            .inputName:focus {
                border: 1px solid rgb(178, 203, 236);
                outline: none;
            }
        </style>
        <div class="input-container">
            <p class="lblName">Nombre:</p>
            <input type="text" placeholder="Ej: Mauricio" class="inputName">
        </div>
        <button id="btnGuardar">Guardar</button>
        `;

        // evento del botón
        this.shadowRoot.querySelector("#btnGuardar").addEventListener("click", () => this.guardarNombre());
    }

    fechaActual() {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;  // meses van de 0 a 11, por eso +1
        const dia = fecha.getDate();
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();
        const segundos = fecha.getSeconds();
        const fecha_actual={
            "año":año,
            "mes":mes,
            "dia":dia,
            "hora":hora,
            "minutos":minutos,
            "segundos":segundos
        }
        return fecha_actual
    }
    guardarNombre() {
        const input = this.shadowRoot.querySelector(".inputName");
        let name = input.value;
        let puntaje = 7
        let fecha = this.fechaActual()
        fecha =(`${fecha.dia}/${fecha.mes}/${fecha.año} ${fecha.hora}:${fecha.minutos}:${fecha.segundos}`);
        
        if (name.trim()===""){
            name="Anonymous"
        }
        localStorage.setItem(name, JSON.stringify([{name,name},{ puntaje, puntaje },{ fecha, fecha }]))
    }
}

customElements.define("input-name", InputName);