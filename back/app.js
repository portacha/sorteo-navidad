const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('miBaseDeDatos.db');
const winners = ['abcd', 'efgh', 'ijkl', 'mnop', 'qrst'];
const premios = [
  'https://www.muycomputer.com/wp-content/uploads/2023/01/Nintendo-Switch-OLED.jpg',
  'https://www.steren.com.mx/media/catalog/product/cache/0236bbabe616ddcff749ccbc14f38bf2/image/20986abca/audifonos-bluetooth-con-bateria-de-hasta-30-h.jpg',
  'https://www.fotomecanica.mx/media/catalog/product/cache/243b585d5b053344651ac1ff3b7a4649/1/5/1561866720000_1346735.jpg',
  'https://m.media-amazon.com/images/I/81BT4absZ5L._AC_UF894,1000_QL80_.jpg',
  'https://cdn1.coppel.com/images/catalog/pm/2107923-1.jpg'
];
// if number of winners is greater than number of prizes then stop server
if (winners.length != premios.length) {
  console.error('Error: number of winners is greater than number of prizes');
  process.exit(1);
}
//check if table PREMIOS or GANADORES exists
db.serialize(() => {
  db.run('DROP TABLE IF EXISTS PREMIOS');
  db.run('DROP TABLE IF EXISTS GANADORES');
  db.run('CREATE TABLE IF NOT EXISTS PREMIOS (id INTEGER, imagen TEXT, activo BOOLEAN)');
  db.run('CREATE TABLE IF NOT EXISTS GANADORES (id TEXT, nombre TEXT, premio INTEGER)');
  // insert default data for PREMIOS
  const stmt = db.prepare('INSERT INTO PREMIOS VALUES (?,?,?)');
  premios.forEach((premio, index) => {
    stmt.run(index + 1, premio, true);
  });
  // insert default data for GANADORES
  const stmt2 = db.prepare('INSERT INTO GANADORES VALUES (?,?,?)');
  winners.forEach((winner, index) => {
    stmt2.run(winner, null, null);
  });
  //show all data
  db.each('SELECT * FROM PREMIOS', (err, row) => {
  });
  db.each('SELECT * FROM GANADORES', (err, row) => {
  });
});

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('./../front'));


app.get('/api/get-all-prizes', (req, res) => {
  // Lógica de tu método aquí
  get_premios((result) => {
    console.log(result.todos);
    res.json({
      todos_los_premios: result.todos
    });
  });
});

app.get('/api/check-code', async (req, res) => {
  try {
    // Verifica que vengan los parámetros
    if (!req.query.code || !req.query.name) {
      res.json({ error: 'Faltan parámetros' });
      return;
    }

    const isValid = await check_code(req.query.code, req.query.name);
    if (isValid.response) {
      const code = req.query.code;
      const name = req.query.name;
      let randPrize = await get_random_prize(code, name);
      isValid.prize = {};
      isValid.prize.id = randPrize.code;
      isValid.prize.nombre = randPrize.name;
      isValid.prize.premio = randPrize.premio.id;
      isValid.prize.imagen = randPrize.premio.imagen;
      res.json({ is_valid: isValid.response, message: isValid.message, prize: isValid.prize });
    } else {
      console.log(isValid)
      if (isValid.prize == null) {
        res.json({ is_valid: isValid.response, message: isValid.message, prize: null });
      } else {
        isValid.prize.imagen = await get_image(isValid.prize.premio);
        res.json({ is_valid: isValid.response, message: isValid.message, prize: isValid.prize });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.get('/api/get-winners', async (req, res) => {
  res.json({
    winners: await get_winners()
  });
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})




function get_premios(callback) {
  let todos = [];
  let faltantes = [];
  db.serialize(() => {
    db.each('SELECT * FROM PREMIOS', (err, row) => {
      //delete row.id;
      todos.push(row);
      if (row.activo) {
        //remove id variable
        faltantes.push(row);
      }
    }, () => {
      // Llamada al callback cuando todas las consultas están completas
      callback({ todos, faltantes });
    });
  });
}

function check_code(code) {
  return new Promise((resolve, reject) => {
    let isValid = {
      response: false,
      message: 'Codigo invalido',
      prize: null
    };

    db.each('SELECT * FROM GANADORES', (err, row) => {
      if (row.id == code) {
        if (row.premio != null && row.nombre != null) {
          console.log('codigo ya usado');
          isValid.message = 'Código ya usado';
          isValid.response = false;
          isValid.prize = row;
        } else {
          console.log('codigo valido');
          isValid.message = 'Código válido';
          isValid.response = true;
        }
      }

    }, () => {
      resolve(isValid);
    });
  });
}

async function get_random_prize(code, name) {
  try {
    const premios = await get_active_prizes();
    const premio = premios[Math.floor(Math.random() * premios.length)];
    console.log(premio);
    await update_winner(code, premio, name);
    return { premio, code, name };
  } catch (error) {
    throw error;
  }
}

function get_active_prizes() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM PREMIOS WHERE activo = 1', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}


async function update_winner(code, premio, name) {
  try {
    await updateGanadores(code, premio, name);
    await updatePremios(premio.id);
    console.log('Ganador actualizado');
    console.log(`Ganador: ${name}, Premio: ${premio.id}, Código: ${code}`);
  } catch (error) {
    throw error;
  }
}

function updateGanadores(code, premio, name) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE GANADORES SET nombre = ?, premio = ? WHERE id = ?', [name, premio.id, code], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function updatePremios(premioId) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE PREMIOS SET activo = ? WHERE id = ?', [false, premioId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function get_winners() {
  return new Promise((resolve, reject) => {
    // Realizar una consulta para obtener el nombre, premio e imagen
    db.all(`
      SELECT GANADORES.nombre, PREMIOS.id as premio_id, PREMIOS.imagen
      FROM GANADORES
      INNER JOIN PREMIOS ON GANADORES.premio = PREMIOS.id
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        console.log(rows);
        resolve(rows); // Debes resolver la promesa con los resultados
      }
    });
  });
}

async function get_image(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT imagen FROM PREMIOS WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.imagen);
      }
    });
  });
}
