// Array de imágenes de premios
// Si las imágenes están en la misma carpeta que este archivo, deja el prefijo como está
let token;
$('#tokenModal').modal('show');
//check if the token is not empty when clic on #tokenButton
$('#tokenButton').click(function(){
    if($('#tokenInput').val() == ""){
        $('#tokenInput').addClass('is-invalid');
    }else{
        $('#tokenModal').modal('hide');
    }
});



let prefix = "./images/";
const prizes = [
    'slideImage (1).jpg',
    'https://previews.123rf.com/images/farang/farang1206/farang120600017/13941740-puesta-del-sol-escena-disparo-de-larga-exposici%C3%B3n-composici%C3%B3n-panor%C3%A1mica-vertical-hdr.jpg',
    'slideImage (3).jpg',
    'slideImage (4).jpg',
    'https://mlaxuzdwqkiz.i.optimole.com/cnaNF2M-cUl3qoZn/w:748/h:420/q:90/https://lovenoho.com/wp-content/uploads/2021/04/looono.png',
    // Agrega más imágenes según sea necesario
];
const allPrices = [...prizes];

// Controlador de eventos para el botón de rifa
document.getElementById('raffleButton').addEventListener('click', async function () {
    if (prizes.length > 0) {
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
                randomIndex = Math.floor(Math.random() * prizes.length);
                if (randomIndex == randomIndexAfter){
                    while (randomIndex == randomIndexAfter && prizes.length > 1) {
                        randomIndex = Math.floor(Math.random() * prizes.length);
                    }
                }
                randomIndexAfter = randomIndex;
                if(allPrices[randomIndex].startsWith("http")){
                    selectedPrize = prizes[randomIndex];
                }else{
                    selectedPrize = prefix + prizes[randomIndex];
                }                
                console.log("Prize: " + prizes[randomIndex])
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
                if(allPrices[randomIndex].startsWith("http")){
                    selectedPrize = allPrices[randomIndex];
                }else{
                    selectedPrize = prefix + allPrices[randomIndex];
                }
            }
            console.log("ciclo:" + i + " randomIndex: " + randomIndex + " randomIndexAfter: " + randomIndexAfter )
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
                        $('#exampleModal').modal('show');

                    }, tiempoDeEspera/2);
    
                }
            }, tiempoDeEspera/2);
            // se agrega el fade out
            
            element.innerHTML = '<img src="' + selectedPrize + '" class="img-fluid" alt="Premio">';

        }, tiempoDeEspera);
    });


}
