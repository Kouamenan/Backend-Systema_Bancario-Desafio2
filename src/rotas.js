const express = require('express');
const {validarSenha, validarSenhaSaldo} = require('./intermediarios');


const contas = require('./controladores/contas');

const rotas = express();

rotas.post('/contas', contas.criarConta);
rotas.get('/contas/saldo', validarSenhaSaldo, contas.saldoConta)
rotas.get('/contas/extrato', validarSenhaSaldo, contas.extratoConta)

rotas.use(validarSenha);

rotas.get('/contas',  contas.listarContas);
rotas.put('/contas/:numeroConta/usuario', contas.atualizarUsuarioDaConta);
rotas.delete('/contas/:numeroConta', contas.excluirConta)
rotas.post('/contas/transacoes/depositar', contas.depositar)
rotas.post('/contas/transacoes/sacar', contas.sacar)
rotas.post('/contas/transacoes/transferir', contas.transferir)



module.exports = rotas;