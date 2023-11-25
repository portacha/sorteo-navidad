// Array de imágenes de premios
// Si las imágenes están en la misma carpeta que este archivo, deja el prefijo como está
let token;
let responseCheckCode;
let prefix = "./images/";

$('#tokenModal').modal('show');
//check if the token is not empty when clic on #tokenButton
$('#tokenButton').click(async function(){
    let token = $('#tokenInput').val();
    let name = $('#nameImput').val();
    if(token == ""){
        $('#tokenInput').addClass('is-invalid');
    }else if(name == ""){
        $('#nameImput').addClass('is-invalid');
    }else{
        responseCheckCode = await checkCode(token, name);
        $('#tokenModal').modal('hide');
        if(!responseCheckCode.is_valid && responseCheckCode.prize != null){
            $('#tokenUsado').modal('show');
            $("#tokenUsadoData").html("Token usado por: "+responseCheckCode.prize.nombre);
            animationRandom(responseCheckCode.prize.imagen, 2000, true);
        }else if(!responseCheckCode.is_valid && responseCheckCode.prize == null){
            $('#tokenInvalido').modal('show');
            $('#tokenReButton').click(function(){
                $('#tokenInvalido').modal('hide');
                $('#tokenModal').modal('show');
            });
        }
    }
});



// Controlador de eventos para el botón de rifa
document.getElementById('raffleButton').addEventListener('click', async function () {
    const prizes = await getAllPrizes();
    if (prizes.length > 0) {
        const allPrices = [...prizes];
        // Selecciona aleatoriamente un premio
        let randomIndex;
        let selectedPrize;

        //Dehabilita el botón de rifa
        //document.getElementById('raffleButton').disabled = true;

        // Configuración para la desaceleración cuadrática
        let desaceleracion = 50; // Ajusta este valor según tus necesidades
        let tiempoTotal = 800; // 10 segundos (puedes ajustar el tiempo total)
        let tiempoPorCiclo = tiempoTotal / 20;
        let randomIndexAfter;
        let randomCicles = 10;
        for (let i = 0; i < randomCicles; i++) {
            let winner = false;
            if (randomCicles == i + 1) {
                selectedPrize = responseCheckCode.prize.imagen;
                console.log("Prize: " + prizes[randomIndex].id)
                winner = true;
            } else {
                randomIndex = Math.floor(Math.random() * allPrices.length);
                if (prizes.length > 1) {
                    if (randomIndex == randomIndexAfter){
                        while (randomIndex == randomIndexAfter) {
                            randomIndex = Math.floor(Math.random() * allPrices.length);
                        }
                    }
                }
                randomIndexAfter = randomIndex;
                // if allPrices[randomIndex] being with http or https, then it is a url
                if(allPrices[randomIndex].imagen.startsWith("http")){
                    selectedPrize = allPrices[randomIndex].imagen;
                }else{
                    selectedPrize = prefix + allPrices[randomIndex].imagen;
                }
            }
            //console.log("ciclo:" + i + " randomIndex: " + randomIndex + " randomIndexAfter: " + randomIndexAfter )
            // Ajusta la desaceleración cuadrática aquí
            let tiempoDeEspera = desaceleracion * Math.pow(i, 2) + tiempoPorCiclo * (i +10);
            animationRandom(selectedPrize, tiempoDeEspera, winner);
        }

        // Elimina el premio seleccionado del array
        prizes.splice(randomIndex, 1);
    } else {
        // Todos los premios han sido ganados
        document.getElementById('prizeDisplay').innerHTML = '<p>Todos los premios han sido ganados.</p>';
    }
});

function animationRandom(selectedPrize, tiempoDeEspera, winner) {
    // Muestra la imagen del premio con desaceleración cuadrática
    // el lugar de modificar el elemento, se crea uno nuevo en document.getElementById('prizeDisplay')
    let elementToCreateANewOne = document.getElementById('prizeDisplay');
    let element = document.createElement("div");
    element.setAttribute("class", "prizeDisplayInner");
    // pop
    elementToCreateANewOne.appendChild(element);
    console.log("tiempoDeEspera: " + tiempoDeEspera)

    return new Promise(resolve => {
        setTimeout(function () {
            // agrega un fade in con zoom in
            element.style = 'opacity: 0; transform: scale(.8); transform: translateY(-320px);';
            // se agrega una transición de 1 segundo
            setTimeout(function () {
                element.style = 'opacity: 1; transition:' +tiempoDeEspera/5000+'s; transform: scale(1); transform: translateY(0px);';
                if (winner) {
                    setTimeout(() => {
                        $('#tokenUsado').modal('hide');
                        $('#exampleModal').modal('show');
                    }, tiempoDeEspera/2);
    
                }
            }, tiempoDeEspera/2);
            // se agrega el fade out
            
            element.innerHTML = '<img src="' + selectedPrize + '" class="img-fluid" alt="Premio">';
        }, tiempoDeEspera);
    });


}

async function getAllPrizes() {
    try {
        const response = await fetch('/api/get-all-prizes');
        return await response.json().then(data => {
            console.log(data.todos_los_premios);
            return data.todos_los_premios;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function checkCode(code, name) {
    try {
        const response = await fetch(`/api/check-code?code=${code}&name=${name}`);
        const data = await response.json();
        console.log(data);
        return data; // Devuelve el valor recibido de la respuesta
    } catch (error) {
        console.error('Error checking code:', error);
    }
}


async function getWinners() {
    try {
        const response = await fetch('/api/get-winners');
        return response.json().then(data => {
            console.log(data);
            // Puedes agregar más lógica aquí si es necesario
        });
    } catch (error) {
        console.error('Error fetching winners:', error);
    }
}


