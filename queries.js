const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'steven',
//   host: 'localhost',
//   database: 'steven',
//   password: 'okdoc',
//   port: 5432,
// })

const pool = new Pool({connectionString:process.env.DATABASE_URL});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

// const getDemographics = (request, response) => {
//   pool.query('SELECT * FROM demographics', (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).json(results.rows)
//   })
// }

// const writeDemographics = (request, response) => {
//     console.log("inside writeDemographics");
//     const {time, demoobj } = request.body
//     console.log(request.body);
//   pool.query('INSERT INTO demographics (time, demoobj) VALUES ($1, $2)', [time, demoobj], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(201).send(`demoobj added with ID: ${result.insertId}`)
//   })
// }

// const writeResponse = (request, response) => {
//     console.log("inside writeResponse");
//     const {time, responseobj} = request.body
//     console.log(request.body);
//     pool.query('INSERT INTO responses (time, responseobj) VALUES ($1, $2)', [time, responseobj], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(201).send(`response added with ID: ${result.insertId}`)
//   })
// }

// module.exports = {
//     writeDemographics,
//     writeResponse,
// }
