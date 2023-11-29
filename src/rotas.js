const express = require('express')
const { cadastrarEmail, enviarNewsletter } = require('./controlador/newsletter')
const rotas = express()

rotas.post('/email',cadastrarEmail)
rotas.post('/newsletter',enviarNewsletter)





module.exports = rotas