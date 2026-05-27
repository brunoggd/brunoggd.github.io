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
        if(this.preguntaActual >= this.preguntas.length) {
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
        console.log("Fecha obtenida")
        return this.fecha_actual
    }
    formatearFechaActual(){
        this.fecha = this.obtenerFechaActual()
        this.fecha =  `${this.fecha.dia}/${this.fecha.mes}/${this.fecha.año} ${this.fecha.hora}:${this.fecha.minutos}:${this.fecha.segundos}`;
        console.log("Fecha formateada")
        return this.fecha
    }
    devolverFechaActual(){
        this.fecha= this.formatearFechaActual()
        console.log("Fecha devuelta")
        return this.fecha
    }
    
    guardarDatosPartida(dificultad_seleccionada,categoria_seleccionada, nombre_jugador){
        this.datos={
            "jugador":nombre_jugador,
            "dificultad":dificultad_seleccionada,
            "categoria":categoria_seleccionada,
            "puntaje":this.puntaje,
            "fecha":this.devolverFechaActual()
        }
    }
    cargarDatosPartida(){
        console.log("DATOS DE LA PARTIDA:")
        console.log(this.datos)
    }
}

export default TriviaGAME;