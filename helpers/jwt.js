const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secreta;
    const api = process.env.API_URL

    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked    
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/productos(.*)/ , methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categorias(.*)/ , methods: ['GET', 'OPTIONS', 'POST'] },
            { url: /\/api\/v1\/usuarios\/.*/,methods: ['GET']},
            `${api}/usuarios/login`,
            `${api}/usuarios/register`
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.esAdmin) {
        done(null, true)
    }

    done();
}

module.exports = authJwt;
 