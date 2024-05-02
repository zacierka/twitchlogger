const { createConnection } = require('mysql2');

function getDBConnection() {
    return createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_APPUSER,
        password: process.env.MYSQL_APPPASSWORD,
        port: process.env.MYSQL_DOCKER_PORT,
        database: process.env.MYSQL_DATABASE
    })
}

module.exports = getDBConnection;
 