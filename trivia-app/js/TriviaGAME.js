// Bruno González - Martín Baras

class TriviaGAME {
    constructor() {
        this.preguntas = [];
        this.preguntaActual = 0;
        this.puntaje = 0;
    }

    iniciar(preguntas) {
        this.preguntas = preguntas;
        this.preguntaActual = 0;
        this.puntaje = 0;
    }

    getPreguntaActual() {
        return this.preguntas[this.preguntaActual];
    }

    siguiente() {
        this.preguntaActual ++;
    }

    responder(respuesta) {
        if(respuesta === this.getPreguntaActual().correct_answer) {
            setTimeout(() => {
                this.puntaje++;
                this.siguiente();;
            }, 1500);
            
            return true;
        }

        else {
            setTimeout(() => {
                this.siguiente();;
            }, 1500);

            return false;
        }
    }

    haTerminado() {
        // if(this.preguntaActual >= this.preguntas.length) {
        if(this.preguntaActual >= 1) {
            
            return true;
        }

        else {
            return false;
        }
    }
    obtenerFechaActual() {
        this.fecha = new Date();
        this.año = this.fecha.getFullYear();
        this.mes = this.fecha.getMonth() + 1;  // meses van de 0 a 11, por eso +1
        this.dia = this.fecha.getDate();
        this.hora = this.fecha.getHours();
        this.minutos = this.fecha.getMinutes();
        this.segundos = this.fecha.getSeconds();
        this.fecha_actual={
            "año":this.año,
            "mes":this.mes,
            "dia":this.dia,
            "hora":this.hora,
            "minutos":this.minutos,
            "segundos":this.segundos
        }
        return this.fecha_actual
    }
    formatearFechaActual(){
        this.fecha = this.obtenerFechaActual()
        this.fecha =  `${this.fecha.dia}/${this.fecha.mes}/${this.fecha.año} ${this.fecha.hora}:${this.fecha.minutos}:${this.fecha.segundos}`;
        return this.fecha
    }
    devolverFechaActual(){
        this.fecha = this.formatearFechaActual()
        return this.fecha
    }
    guardarDatosPartida(dificultad_seleccionada,categoria_seleccionada,categoria_seleccionada_texto, nombre_jugador){
        this.datos={
            "jugador":nombre_jugador,
            "dificultad":dificultad_seleccionada,
            "categoria":categoria_seleccionada_texto,
            "puntaje":this.puntaje,
            "fecha":this.devolverFechaActual()
        }
        localStorage.setItem(`tg${localStorage.length}`, JSON.stringify(this.datos))
        
    }
    cargarPartidas(){
        const historial = document.querySelector("trivia-historial");
        const partidas = historial.shadowRoot.getElementById("partidas");

        let partida = "";

        for(let indice = 0; indice < localStorage.length; indice++) {
            const clave = localStorage.key(indice);
            if (clave.includes("tg")) {
                const datos = JSON.parse(localStorage.getItem(clave)); //getItem trae un JSON en formato string, JSON.parse convierte el string a formato JSON
                partida += `
                    <trivia-partida posicion="${indice + 1}">
                        <span slot="posicion">${indice + 1}</span>
                        <span slot="jugador">${datos.jugador}</span>
                        <span slot="puntuacion">${datos.puntaje}</span>
                        <span slot="dificultad">${datos.dificultad}</span>
                        <span slot="categoria">${datos.categoria}</span>
                        <span slot="fecha">${datos.fecha}</span>
                    </trivia-partida>
                `;
                partidas.innerHTML = partida;
            }
        }
            
        
    }
    
}

export default TriviaGAME;