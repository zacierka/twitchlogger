const { createConnection } = require('mysql2');

function getDBConnection() {
    return createConnection({
        host: process.env.DEBUG_MYSQL_HOST,
        user: process.env.DEBUG_MYSQL_APPUSER,
        password: process.env.DEBUG_MYSQL_ROOT_PASSWORD,
        port: process.env.DEBUG_MYSQL_DOCKER_PORT,
        database: process.env.DEBUG_MYSQL_DATABASE
    })
}

module.exports = getDBConnection;
