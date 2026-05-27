// Bruno González - Martín Baras

class TriviaAPI {
    constructor() {
    }
    async getPreguntas(cantidad = 10, categoria = "", dificultad = "") {
        const endpoint = `https://opentdb.com/api.php?amount=${cantidad}&category=${categoria}&difficulty=${dificultad}&type=multiple`;
        
        try {
            const response = await fetch(endpoint);

            if(!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.results;

        } catch (error) {
            console.error('Falló la petición:', error.message);
        }

    }

    async getCategorias() {
        const endpoint = "https://opentdb.com/api_category.php";
        
        try {
            const response = await fetch(endpoint);

            if(!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.trivia_categories;

        } catch (error) {
            console.error('Falló la petición:', error.message);
        }
    }

}

export default TriviaAPI;