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
}

export default TriviaGAME;