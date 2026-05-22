// Bruno González - Martín Baras

import TriviaAPI from "./TriviaAPI.js";
import TriviaGAME from "./TriviaGAME.js";

const api = new TriviaAPI();
const game = new TriviaGAME();

const contenedor_general = document.querySelector('#general-wrapper');
contenedor_general.classList.add('wrapper','general-wrapper', 'small-gap');

let dificultad_seleccionada;
let categoria_seleccionada;

function decodificarHTML(texto) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = texto;
    return textarea.value;
}

function Mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function ValoresDefaultMenu(titulo_dificultad, selector_categorias){
    titulo_dificultad.textContent = "Seleccione una dificultad";
    dificultad_seleccionada = '';
    categoria_seleccionada = '';
    selector_categorias.value="1";
}

const template_botones = document.createElement('template');

template_botones.innerHTML = `
<style>
    .button {
        text-align: center;
        font-weight: 700;
        font-size: 20px;
        transition: all 0.5s;
        cursor: pointer;
        border-radius: 25px;
        border: 4px solid gray;
        overflow: auto;
    }

    .button:hover {
        transform: scale(1.1) translateY(-5px);
        box-shadow: 0 4px 4px 0 #0009;
    }

    :host([tipo="dif-easy"]) .button {
        width: 130px;
        height: 65px;
        margin: 0 15px;
        font-size: 16px;
        border: 2px solid green;
        background: rgb(114, 186, 7);
    }

    :host([tipo="dif-easy"]) .button:hover {
        box-shadow: 0 4px 4px 0 green;
    }

    :host([tipo="dif-medium"]) .button {
        width: 130px;
        height: 65px;
        margin: 0 15px;
        font-size: 16px;
        border: 2px solid rgb(176, 176, 1);
        background: rgb(252, 252, 82);
    }

    :host([tipo="dif-medium"]) .button:hover {
        box-shadow: 0 4px 4px 0 rgb(176, 176, 1);
    }

    :host([tipo="dif-hard"]) .button {
        width: 130px;
        height: 65px;
        margin: 0 15px;
        font-size: 16px;
        border: 2px solid red;
        background: rgb(247, 62, 62);
    }

    :host([tipo="dif-hard"]) .button:hover {
        box-shadow: 0 4px 4px red;
    }

    :host([tipo="play"]) .button {
        width: 150px;
        border: 3px solid #5C5CFF;
        background: #8A8AFF;
        margin-bottom: 20px;
    }

    :host([tipo="play"]) .button:hover {
        box-shadow: 0 4px 4px 0 #5C5CFF;
    }

    :host([tipo="answer"]) .button {
        width: 200px;
        min-height: 50px;
        background-color: #F0F0F0;
    }

    :host([tipo="answer"]) .button:hover {
        background-color: #C9C9C9;
    }

    :host([tipo="reset"]) .button {
        background-color: #F0F0F0;
    }

    :host(.respuesta-correcta) .button {
        background: #58ED72;
        border: 4px solid #0B6A1B;
    }

    :host(.respuesta-correcta) .button:hover {
        background: #58ED72;
    }

    :host(.respuesta-incorrecta) .button {
        background: #ED5858;
        border: 4px solid #E71818;
    }

    :host(.respuesta-incorrecta) .button:hover {
        background: #ED5858;
    }

    .question-text {
        font-size: 1rem;
        text-align: center;
        justify-content: center;
        margin: auto;
    }
    @media(max-width:490px){
        :host([tipo="dif-easy"]) .button {width:80px;height:60px;margin:0}
        :host([tipo="dif-medium"]) .button {width:80px;height:60px;margin:0}
        :host([tipo="dif-hard"]) .button {width:80px;height:60px;margin:0}}
    @media (min-width: 1080px) {
        :host([tipo="dif-easy"]) .button {width: 200px;height: 200px;}
        :host([tipo="dif-medium"]) .button {width: 200px;height: 200px;}
        :host([tipo="dif-hard"]) .button {width: 200px;height: 200px;}

        .button-text {font-size: 2rem;}
    }
</style>

<button class="button">
    <slot name="titulo" class="button-text">Título del botón</slot>
</button>`;

class Botones extends HTMLElement {
    static get observedAttributes() {
        return ['tipo'];
    }

    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(template_botones.content.cloneNode(true));
    }

    connectedCallback() {
        console.log('Insertado en el DOM');
    }

    attributeChangedCallback(nombre, anterior, nuevo) {
        console.log(`${nombre} ha sido modificado: ${anterior} → ${nuevo}`);
    }

    disconnectedCallback() {
        console.log('Elemento Removido del DOM');
    }
}

customElements.define('trivia-boton', Botones);

const template_selector = document.createElement('template');

template_selector.innerHTML = `
<style>
    .selector {
        width: 100%;
        height: 50px;
        border-radius: 25px;
        font-size: 18px;
        text-wrap: pretty;
        text-indent: 15px;
        font-weight: 100;
        background: #A464F7;
        border: 2px solid #34066F;
        transition: all 0.5s;
        outline: 0;
    }

    .selector:hover {
        box-shadow: 0 4px 4px 0 #34066F;
    }

    .selector option {
        background-color: #BD90F9;
        font-weight: 100;
        transition: all 0.5s;
    }

    .small-gap {
        gap: 25px;
    }
</style>

<select id="categories-group" class="selector"></select>`;

class Selector extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(template_selector.content.cloneNode(true));

        this.selector_categorias = this.shadow.querySelector('#categories-group');

        this.CargarCategorias();
    }

    connectedCallback() {
        console.log('Insertado en el DOM');
        this.selector_categorias.innerHTML=`<option>Cargando categorias...</option>`;

        this.selector_categorias.addEventListener('change', () => {
            if (this.selector_categorias.value === "1") {
                this.selector_categorias.value = 9;
            }

            categoria_seleccionada = this.selector_categorias.value;
        });
    }

    attributeChangedCallback(nombre, anterior, nuevo) {
        console.log(`${nombre} ha sido modificado: ${anterior} → ${nuevo}`);
    }

    disconnectedCallback() {
        console.log('Elemento Removido del DOM');
    }

    async CargarCategorias() {
        try {
            const categorias = [{ "id": 1, "name": "Seleccione una categoría" }];
            const demas_categorias = await api.getCategorias();
            const categorias_totales = categorias.concat(demas_categorias);

            this.selector_categorias.innerHTML = categorias_totales.map(c => `<option value="${c.id}" class="selector">${c.name}</option>`).join('');

            this.shadow.querySelector('#boton-reiniciar-categorias')?.remove();
            // Busca si existe un elemento con este id y si existe lo elimina, el (?) evita que explote todo si el elemento no existe. Si existe el elemento, se borra, y si no, nada.

        } catch (error) {
            this.selector_categorias.innerHTML = `<option>Error al cargar categorías</option>`;

            this.shadow.querySelector('#boton-reiniciar-categorias')?.remove();

            this.selector_categorias.insertAdjacentHTML("afterend", `<trivia-boton id="boton-reiniciar-categorias" tipo="reset">
                                                                        <p slot="titulo">Recargar Categorías</p>
                                                                    </trivia-boton>`);
            // insertAdjacentHTML: Inserta HTML dinámico en un lugar específico del contenedor, sin reemplazar todo lo otro. "beforeend" es para que se inserte lo que quiera justo antes de cerrar la etiqueta del contenedor.

            this.boton_reiniciar_categorias = this.shadow.querySelector('#boton-reiniciar-categorias');

            this.boton_reiniciar_categorias.addEventListener('click', () => {
                this.CargarCategorias();
                this.selector_categorias.innerHTML = `<option>Reiniciando búsqueda...</option>`
            });
        }
    }
}

customElements.define('trivia-selector', Selector);

const template_menu_inicio = document.createElement('template');

template_menu_inicio.innerHTML = `
<style>
    :host {
        margin: auto;
    }

    .wrapper {
        display: flex;
        overflow: visible;
        align-items: center;
        justify-content: center;
        text-wrap: pretty;
        transition: all 0.5s;
    }

    .menu-style {
        width: 95vw;
        height: 95vh;
        background: linear-gradient(#F2F2F2,#C4C4C4);
        border-radius: 25px;
        border: 3px solid gray;
        box-shadow: 0 0 15px 0 #0009;
        flex-direction: column;
    }

    .play-button-wrapper {
        width: 100%;
        height: 20%;
    }

    .categories-group {
        flex-direction: column;
        margin: 40px;
        scale: 120%;
    }

    .dif-buttons-container {
        width: fit-content;
        height: fit-content;
        flex-direction: column;
    }

    .margin-auto {
        margin: auto;
    }

    .main-title {
        font-size: 25px;
        text-align: center;
        text-shadow: 0 0 5px  rgba(0, 0, 0, 0.35);
    }

    .title-2 {
        color: black;
        text-align: center;
    }

    .small-gap {
        gap: 5px;
    }

    @media (max-height:860px){
    .dif-buttons-container {
        flex-direction: row;
    }
    }
    @media (min-width: 768px) {
        .dif-buttons-container {
            flex-direction: row;
        }
    }
</style>

<div id="contenedor-menu" class="wrapper menu-style margin-auto">
    <h2 class="main-title">Trivia</h2>
    <h2 id="titulo-dificultad" class="title-2">Seleccione una dificultad</h2>
    <div class="wrapper dif-buttons-container small-gap">
        <trivia-boton id="boton-dif-facil" data-difficulty="Fácil" tipo="dif-easy">
            <p slot="titulo">Fácil</p>
        </trivia-boton>
        <trivia-boton id="boton-dif-medio" data-difficulty="Medio" tipo="dif-medium">
            <p slot="titulo">Medio</p>
        </trivia-boton>
        <trivia-boton id="boton-dif-dificil" data-difficulty="Difícil" tipo="dif-hard">
            <p slot="titulo">Difícil</p>
        </trivia-boton>
    </div>
    <div class="wrapper categories-group small-gap">
        <trivia-selector id="categories-group"></trivia-selector>
    </div>
    <div class="wrapper play-button-wrapper">
        <trivia-boton id="play-button" tipo="play">
            <p slot="titulo">Jugar</p>
        </trivia-boton>
    </div>
</div>`;

class TriviaMenuInicio extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(template_menu_inicio.content.cloneNode(true));

        this.boton_dif_facil = this.shadow.querySelector('#boton-dif-facil');
        this.boton_dif_medio = this.shadow.querySelector('#boton-dif-medio');
        this.boton_dif_dificil = this.shadow.querySelector('#boton-dif-dificil');

        this.botones_dificultad = [this.boton_dif_facil, this.boton_dif_medio, this.boton_dif_dificil];

        this.titulo_dificultad = this.shadow.querySelector('#titulo-dificultad');

        this.boton_iniciar_juego = this.shadow.querySelector('#play-button');

        this.contenedor_menu = this.shadow.querySelector('#contenedor-menu');
    }

    connectedCallback() {
        console.log('Insertado en el DOM');

        this.botones_dificultad.forEach(boton => {
            boton.addEventListener('click', () => {
                this.titulo_dificultad.textContent = `Dificultad: ${boton.dataset.difficulty}`;

                if (boton.dataset.difficulty === "Fácil") {
                    dificultad_seleccionada = "easy";
                }

                else if (boton.dataset.difficulty === "Medio") {
                    dificultad_seleccionada = "medium";
                }

                else {
                    dificultad_seleccionada = "hard";
                }
            });
        });

        this.boton_iniciar_juego.addEventListener('click', async () => {
            if (dificultad_seleccionada && categoria_seleccionada) {
                this.contenedor_menu.style.display = "none";

                this.dispatchEvent(new CustomEvent('game-loading', {
                    detail: {
                        dificultad: dificultad_seleccionada,
                        categoria: categoria_seleccionada
                    }
                    // detail: Es un objeto que se define para pasar información junto con el evento.
                }));
            }
            else if (!dificultad_seleccionada){alert('Seleccione una dificultad');}
            else if (!categoria_seleccionada || categoria_seleccionada==="1"){alert('Seleccione una categoria');}
        });
    }

    attributeChangedCallback(nombre, anterior, nuevo) {
        console.log(`${nombre} ha sido modificado: ${anterior} → ${nuevo}`);
    }

    disconnectedCallback() {
        console.log('Elemento Removido del DOM');
    }
}

customElements.define('trivia-menu-inicio', TriviaMenuInicio);

const template_scoreboard = document.createElement('template');

template_scoreboard.innerHTML = `
<style>
    :host {
        margin: auto;
    }

    .wrapper {
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        overflow-x: hidden;
        margin: auto;
        align-items: center;
        justify-content: center;
        text-wrap: pretty;
        transition: all 0.5s;
    }

    .question-score-index-container{
        width: 75vw;
        height: 50px;
        background-color:#F2F2F2;
        margin-bottom: 10px;
        border-radius: 25px;
        border: 3px solid gray;
        box-shadow: 0 0 15px 0 #0009;
        justify-content: space-evenly;
    }

    .question-title {
        color: black;
        font-size: 17px;
        font-weight: 100;
        background: transparent;
    }

    .margin-auto {
        margin: auto;
    }

    .small-gap {
        gap: 10px;
    }
</style>

<div id="scoreboard-container" class="wrapper question-score-index-container margin-auto small-gap"></div>`;

class Puntuacion_e_Informacion extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(template_scoreboard.content.cloneNode(true));

        this.aumento = 1;

        this.contenedor_scoreboard = this.shadow.querySelector('#scoreboard-container');
    }

    connectedCallback() {
        console.log('Insertado en el DOM');
    }

    attributeChangedCallback(nombre, anterior, nuevo) {
        console.log(`${nombre} ha sido modificado: ${anterior} → ${nuevo}`);
    }

    disconnectedCallback() {
        console.log('Elemento Removido del DOM');
    }

    inicializar_scoreboard(indice_pregunta, puntuacion) {
        this.contenedor_scoreboard.innerHTML = `
        <h2 id="question-index" class="question-title">Pregunta ${indice_pregunta + 1} de 10</h2>
        <h2 id="score" class="question-title">Puntuación: ${puntuacion}</h2>
        `;

        this.etiqueta_indice_pregunta = this.shadow.querySelector('#question-index');
        this.etiqueta_puntuacion = this.shadow.querySelector('#score');
    }

    actualizar(puntuacion, indice_pregunta) {
        this.etiqueta_puntuacion.textContent = `Puntuación: ${puntuacion}`;
        this.etiqueta_indice_pregunta.textContent = `Pregunta ${indice_pregunta + 1} de 10`;
    }
}

customElements.define('trivia-scoreboard', Puntuacion_e_Informacion);

const template_game_over = document.createElement('template');

template_game_over.innerHTML = `
<style>
    :host {
        margin: auto;
        display: none;
    }

    .wrapper {
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        overflow-x: hidden;
        margin: auto;
        align-items: center;
        justify-content: center;
        text-wrap: pretty;
        transition: all 0.5s;
    }

    .game-over-container {
        width: 300px;
        min-height: 500px;
        background: linear-gradient(#F2F2F2,#C4C4C4);
        border-radius: 25px;
        border: 3px solid gray;
        box-shadow: 0 0 15px 0 #0009;
        flex-direction: column;
    }

    .margin-auto {
        margin: auto;
    }

    .main-title {
        font-size: 25px;
        text-align: center;
        margin: auto;
        margin-bottom: 50px;
        text-shadow: 0 0 5px  rgba(0, 0, 0, 0.35);
    }

    .score-container {
        min-width: 75%;
        height: 150px;
        background: linear-gradient(#B6B6B6, #9E9E9E);
        text-align: center;
        align-items: center;
        justify-content: center;
        border-radius: 25px;
        font-size: 75px;
        margin-bottom: 25px;
    }
</style>

<div class="wrapper game-over-container margin-auto">
    <h2 class="main-title">¡Juego terminado!</h2>
    <h2 class="main-title">Puntuación</h2>
    <div id="contenedor-puntuacion-final" class="wrapper score-container">10</div>
    <trivia-boton id="play-again-button" tipo="play">
        <p slot="titulo">Jugar de Nuevo</p>
    </trivia-boton>
</div>`;

class TriviaMenuFin extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(template_game_over.content.cloneNode(true));

        this.contenedor_puntuacion = this.shadow.querySelector('#contenedor-puntuacion-final');
    }

    connectedCallback() {
        console.log('Insertado en el DOM');
    }

    attributeChangedCallback(nombre, anterior, nuevo) {
        console.log(`${nombre} ha sido modificado: ${anterior} → ${nuevo}`);
    }

    disconnectedCallback() {
        console.log('Elemento Removido del DOM');
    }

    obtenerPuntuacionFinal(puntuacion) {
        this.contenedor_puntuacion.textContent = `${puntuacion}`;
    }
}

customElements.define('trivia-menu-game-over', TriviaMenuFin);

const template_juego = document.createElement('template');

template_juego.innerHTML = `
<style>
    :host {
        display: none;
        margin: auto;
        flex-direction: column;
        gap: 10px;
    }

    .wrapper {
        display: flex;
        flex-wrap: wrap;
        overflow: visible;
        margin: auto;
        align-items: center;
        justify-content: center;
        text-wrap: pretty;
        transition: all 0.5s;
    }

    .question-container {
        width: 95vw;
        height: 80vh;
        background: linear-gradient(#F2F2F2,#C4C4C4);
        border-radius: 25px;
        border: 3px solid gray;
        box-shadow: 0 0 15px 0 #0009;
        flex-direction: column;
    }

    .question-box-style {
        background: linear-gradient(#D4D4D4, #ADADAD);
        border-radius: 15px;
        border: 2px solid #969696;
    }

    .question {
        text-wrap: pretty;
        text-align: center;
        font-weight: 100;
        font-size: 20px;
        overflow: auto;
        padding: 25px;
    }

    .margin-auto {
        margin: auto;
    }

    .custom-size {
        width: 100%;
        height: 200px;
    }

    .custom-size-2 {
        width: 95%;
        height: 25vh;
    }

    .small-gap {
        gap: 30px;
    }
    @media(max-width:480px){
    .wrapper{overflow:auto;overflow-x: hidden;}
    }
</style>

<trivia-scoreboard></trivia-scoreboard>
<div id="contenedor-pregunta" class="wrapper question-container">
    <div class="wrapper custom-size-2 question-box-style">
        <p class="question margin-auto">
            ¿?
        </p>
    </div>
    <div class="wrapper fdr custom-size small-gap">
        <trivia-boton id="respuesta-1" tipo="answer">
            <p slot="titulo">Respuesta 1</p>
        </trivia-boton>
        <trivia-boton id="respuesta-2" tipo="answer">
            <p slot="titulo">Respuesta 2</p>
        </trivia-boton>
        <trivia-boton id="respuesta-3" tipo="answer">
            <p slot="titulo">Respuesta 3</p>
        </trivia-boton>
        <trivia-boton id="respuesta-4" tipo="answer">
            <p slot="titulo">Respuesta 4</p>
        </trivia-boton>
    </div>
</div>
<trivia-menu-game-over></trivia-menu-game-over>`;

class TriviaJuego extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(template_juego.content.cloneNode(true));

        this.contenedor_pregunta = this.shadow.querySelector('#contenedor-pregunta');

        this.scoreboard = this.shadow.querySelector('trivia-scoreboard');
        this.menu_gameover = this.shadow.querySelector('trivia-menu-game-over');
    }

    connectedCallback() {
        console.log('Insertado en el DOM');
    }

    attributeChangedCallback(nombre, anterior, nuevo) {
        console.log(`${nombre} ha sido modificado: ${anterior} → ${nuevo}`);
    }

    disconnectedCallback() {
        console.log('Elemento Removido del DOM');
    }

    iniciar(preguntas) {
        this.preguntas = preguntas;
        this.preguntaActual = 0;

        game.iniciar(preguntas);

        this.scoreboard.inicializar_scoreboard(this.preguntaActual, game.puntaje);

        this.MostrarPregunta();
    }

    mostrarError(error) {
        this.contenedor_pregunta.innerHTML = `<p class="question">Error al cargar las preguntas: ${error.message}</p>
                                            <trivia-boton id="boton-reiniciar" tipo="reset">
                                                <p slot="titulo">Reiniciar</p>
                                            </trivia-boton>`;

        const boton_reiniciar = this.contenedor_pregunta.querySelector('#boton-reiniciar');

        boton_reiniciar.addEventListener('click', async () => {
            this.contenedor_pregunta.innerHTML = `<p class="question">Recargando Juego...</p>`;

            this.dispatchEvent(new CustomEvent('game-reload'));

            try {

                const preguntas = await api.getPreguntas(10, categoria, dificultad);
                this.iniciar(preguntas);

            } catch (error) {

                this.mostrarError(error.message);

            }
        });
    }

    MostrarPregunta() {
        const respuesta_correcta = this.preguntas[game.preguntaActual].correct_answer;
        const respuesta_incorrecta_1 = this.preguntas[game.preguntaActual].incorrect_answers[0];
        const respuesta_incorrecta_2 = this.preguntas[game.preguntaActual].incorrect_answers[1];
        const respuesta_incorrecta_3 = this.preguntas[game.preguntaActual].incorrect_answers[2];
        const respuestas = [respuesta_correcta, respuesta_incorrecta_1, respuesta_incorrecta_2, respuesta_incorrecta_3];

        Mezclar(respuestas);

        this.contenedor_pregunta.innerHTML = `<div class="wrapper custom-size-2 question-box-style">
                                            <p class="question margin-auto">
                                                ${decodificarHTML(this.preguntas[game.preguntaActual].question)}
                                            </p>
                                        </div>
                                        <div class="wrapper fdr custom-size small-gap">
                                            <trivia-boton id="respuesta-1" tipo="answer">
                                                <p slot="titulo">${decodificarHTML(respuestas[0])}</p>
                                            </trivia-boton>
                                            <trivia-boton id="respuesta-2" tipo="answer">
                                                <p slot="titulo">${decodificarHTML(respuestas[1])}</p>
                                            </trivia-boton>
                                            <trivia-boton id="respuesta-3" tipo="answer">
                                                <p slot="titulo">${decodificarHTML(respuestas[2])}</p>
                                            </trivia-boton>
                                            <trivia-boton id="respuesta-4" tipo="answer">
                                                <p slot="titulo">${decodificarHTML(respuestas[3])}</p>
                                            </trivia-boton>
                                        </div>`;

        this.boton_rta_1 = this.contenedor_pregunta.querySelector('#respuesta-1');
        this.boton_rta_2 = this.contenedor_pregunta.querySelector('#respuesta-2');
        this.boton_rta_3 = this.contenedor_pregunta.querySelector('#respuesta-3');
        this.boton_rta_4 = this.contenedor_pregunta.querySelector('#respuesta-4');

        const botones_rtas = [this.boton_rta_1, this.boton_rta_2, this.boton_rta_3, this.boton_rta_4];

        botones_rtas.forEach(boton => {
            boton.addEventListener('click', () => {
                let respuesta_elegida = boton.querySelector('p').textContent;

                if (game.responder(respuesta_elegida)) {
                    boton.classList.add('respuesta-correcta');

                }
                else {
                    boton.classList.add('respuesta-incorrecta');
                    botones_rtas.forEach(btn => {
                        if (btn.textContent.trim() === respuesta_correcta) {
                            btn.classList.add('respuesta-correcta');
                        }
                    });
                }

                botones_rtas.forEach(boton => {
                    const boton_interno = boton.shadowRoot.querySelector('.button');
                    // Se entra al shadow DOM del componente en busca de un elemento que tenga la clase .button, se puede usar button también pero es más específico usar la clase.
                    boton_interno.disabled = true;
                });
                setTimeout(() => {
                    if (game.haTerminado()) {
                        this.contenedor_pregunta.style.display = "none";
                        this.scoreboard.style.display = "none";

                        this.menu_gameover.style.display = "flex";
                        this.menu_gameover.obtenerPuntuacionFinal(game.puntaje);

                        const boton_volver_a_jugar = this.menu_gameover.shadowRoot.querySelector('#play-again-button');

                        boton_volver_a_jugar.addEventListener('click', () => {
                            const trivia_menu = document.querySelector('trivia-menu-inicio');
                            
                            const contenedor_menu = trivia_menu.shadowRoot.querySelector('#contenedor-menu');
                            
                            const titulo_dificultad = trivia_menu.shadowRoot.querySelector('#titulo-dificultad');
                            
                            const selector_categorias = trivia_menu.shadowRoot.querySelector('#categories-group');

                            trivia_menu.style.display = "flex";
                            contenedor_menu.style.display = "flex";
                            
                            ValoresDefaultMenu(titulo_dificultad, selector_categorias);
                            
                            this.menu_gameover.style.display = "none";
                        });
                    }
                    else {
                        this.scoreboard.actualizar(game.puntaje, game.preguntaActual);
                        this.MostrarPregunta();
                    }
                }, 2000);
            });
        });
    }
}

customElements.define('trivia-juego', TriviaJuego);

const trivia_juego = document.querySelector('trivia-juego');

const trivia_menu = document.querySelector('trivia-menu-inicio');

trivia_menu.addEventListener('game-loading', async e => {
    // e: Es el objeto del evento que se recibe automáticamente cuando el addEventListener se ejecuta, dentro del e está la información sobre la dificultad y la categoría que elegimos.
    const dificultad = e.detail.dificultad;
    const categoria = e.detail.categoria;

    const contenedor_pregunta = trivia_juego.shadowRoot.querySelector('#contenedor-pregunta');

    contenedor_pregunta.style.display = "flex";
    trivia_juego.style.display = "flex";

    contenedor_pregunta.innerHTML = `<p>Cargando...</p>`;

    async function CargarJuego() {
        try {
            const preguntas = await api.getPreguntas(10, categoria, dificultad);

            trivia_juego.iniciar(preguntas);

            trivia_menu.style.display = "none";

            const scoreboard = trivia_juego.shadowRoot.querySelector('trivia-scoreboard');
            scoreboard.style.display = "flex";

        } catch (error) {
            trivia_juego.mostrarError(error.message);
        }
    }

    setTimeout(CargarJuego, 500);
});