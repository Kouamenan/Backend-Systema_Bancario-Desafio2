let {contas}  = require ('./bancodedados');


const validarSenha = (req, res, next) => {
    const {senha_banco} = req.query;

    if(!senha_banco){
        return res.status(400).json({mensagem: 'A senha do banco não foi informada.'});;
    }

    if(senha_banco !== 'Cubos123Bank'){
        return res.status(401).json({mensagem: 'A senha do banco informada é inválida!'});
    }
    next();
}

const validarSenhaSaldo = (req, res, next) => {
    const {numero_conta, senha} = req.query;

    if(!numero_conta && !senha){
        return res.status(400).json({mensagem: 'A senha e o numero da conta não foi informada.'});;
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });
    if(!conta){
        return res.status(404).json({mensagem: 'Conta bancária não encontada!'})
    }

    if(senha !== conta.usuario.senha){
        return res.status(401).json({mensagem: 'Senha inválida!'});
    }
    res.locals.conta = conta;
    
    next();
}

module.exports = {
    validarSenha,
    validarSenhaSaldo
}