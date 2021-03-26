function errorHandler (err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
        return res.status(401).json({message: "El usuario no esta autenticado"});
    }

    if(err.name === 'ValidationError') {
        return res.status(401).json({message: err});
    }

    return res.status(500).json(err);
} 

module.exports = errorHandler;