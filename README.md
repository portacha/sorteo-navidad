
# Rifa de Premios App

Esta aplicación de rifa de premios está diseñada con una base de datos embebida, lo que significa que cada vez que se apaga la aplicación, las dinámicas se reinician. Para configurar los premios, debes acceder a la ruta `back/app.js` y modificar lo siguiente:

`const winners = ['abcd', 'efgh', 'ijkl', 'mnop', 'qrst'];
const premios = [
  'https://www.muycomputer.com/wp-content/uploads/2023/01/Nintendo-Switch-OLED.jpg',
  'https://www.steren.com.mx/media/catalog/product/cache/0236bbabe616ddcff749ccbc14f38bf2/image/20986abca/audifonos-bluetooth-con-bateria-de-hasta-30-h.jpg',
  'https://www.fotomecanica.mx/media/catalog/product/cache/243b585d5b053344651ac1ff3b7a4649/1/5/1561866720000_1346735.jpg',
  'https://m.media-amazon.com/images/I/81BT4absZ5L._AC_UF894,1000_QL80_.jpg',
  'https://cdn1.coppel.com/images/catalog/pm/2107923-1.jpg'
];` 

Estos son los premios y los códigos asociados para canjearlos por los premios.

## Configuración de Imágenes

Puedes usar imágenes subidas directamente a la aplicación con el mismo dominio, proporcionando la ruta completa, como `http://localhost/TURUTA.jpg`. Además, puedes utilizar solo el nombre del archivo, pero deberás cargarlas en la ruta `./front/images/TUARCHIVO.jpg`. Asegúrate de incluir la extensión del archivo.

## Instrucciones de Ejecución

Para ejecutar la aplicación, simplemente navega al directorio `back`, instala las dependencias con `npm install` y luego inicia la aplicación con `npm start`.

## Dinámica de la Aplicación

La aplicación consta de tres páginas en el front y un API con varios métodos:

1.  **Página de Bienvenida:**
    
    -   Incluye animaciones que se repiten y permiten acceder a las otras dos páginas.
    -   Puede contener sonido, pero se retiró para evitar molestias, ya que se debe hacer clic para reproducir.
    -   Proporciona acceso a las otras dos páginas.
2.  **Página de Premios (`/prize.html`):**
    
    -   Muestra en vivo a los ganadores conforme se sortean sus premios.
    -   Incluye instrucciones para conseguir los códigos que se pueden utilizar para sortear los premios.
3.  **Página de Ganadores (`/winner.html`):**
    
    -   Permite a los jugadores ingresar su nombre y un código para canjearlos por premios.
    -   Los premios canjeados se mostrarán como imágenes.
    -   Cada vez que un usuario canjea un premio, los demás usuarios de la página de premios podrán ver su nombre y lo que ganaron.

Asegúrate de configurar correctamente los parámetros, ya que los premios y códigos son contados, y no se pueden duplicar.

**Nota:** Se requiere npm para ejecutar la aplicación.