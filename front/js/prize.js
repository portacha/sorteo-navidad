let counterElements = 0;

// on load
window.onload = async function () {
    try {
        let winners = await getWiners();
        console.log(winners);
        for (const winner of winners) {
            updateScreen(winner);
        }
    } catch (error) {
        console.error('Error durante la carga inicial:', error);
    }
}

function cambiarImagen(event) {
    const nombrePremio = event.currentTarget.querySelector('h5').innerText;
    const rutaImagen = event.currentTarget.querySelector('img').src;
    document.getElementById("imagenInferior").src = rutaImagen;
    document.getElementById("nombrePremio").innerText = nombrePremio;
}

// Conectar al servidor
const socket = io('http://localhost:3000');

// Manejar eventos del servidor
socket.on('notificacion', (data) => {
    console.log('Notificación recibida en el cliente:', data);
    // Manejar la notificación en el frontend según sea necesario
    updateScreen(data);
});

function updateScreen(winners) {
    let parent = document.querySelector("#premios");
    let element = parent.querySelectorAll(".col-md-2")[counterElements];
    if (element) {
        element.querySelector("h5").innerText = winners.nombre;
        element.querySelector("img").src = winners.imagen;
    }
    counterElements++;

}

async function getWiners(){
    // http://localhost:3000/api/get-winners
    try {
        let response = await fetch('/api/get-winners');
        if (!response.ok) {
            throw new Error(`Error al obtener ganadores: ${response.status}`);
        }
        let data = await response.json();
        return data.winners;
    } catch (error) {
        console.error('Error al obtener ganadores:', error);
        throw error;
    }
}
