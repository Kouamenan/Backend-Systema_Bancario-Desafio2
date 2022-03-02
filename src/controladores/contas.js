let {contas, saques, depositos, transferencias}  = require ('../bancodedados');
const { format } = require('date-fns');

const listarContas =  async (req, res) => {
    try{
        return res.status(200).json(contas);
    }catch (erro) {
        return res.status(500).json('Erro de servidor')
    }
}

const criarConta =  async (req, res) => {
    let numeroDaConta = contas.length + 1;
    const { cpf, email, nome, data_nascimento, telefone, senha } = req.body;
    
    if(!cpf && !email && !nome && !data_nascimento && !telefone && !senha){
        return res.status(400).json({mensagem: 'Todos os campos são obrigatorios.'})
    }
    
    const cpfExiste = contas.find((usuario) =>{
            
        const cpfDoBanco = usuario.usuario.cpf
        
        return cpf === cpfDoBanco;
    })

    if(cpfExiste){
        return res.status(400).json({mensagem: "Já existe uma conta com o cpf ou e-mail informado!"});
    }
    try{
        const conta = {
            numero: numeroDaConta,
            saldo: 0,
             usuario: {
                nome: nome,
                cpf: cpf,
                data_nascimento: data_nascimento,
                telefone: telefone,
                email: email,
                senha: senha
            }
    
        }
        contas.push(conta);
        return res.status(200).json();

    }catch (erro) {
        return res.status(500).json('Erro de servidor')
    }
}

const atualizarUsuarioDaConta =  async (req, res) => {
    let numeroDaConta = contas.length + 1;
    const {numeroConta} = req.params;
    const { cpf, email, nome, data_nascimento, telefone, senha } = req.body;
    
    if(!cpf && !email && !nome && !data_nascimento && !telefone && !senha){
        return res.status(400).json({mensagem: 'Todos os campos são obrigatorios.'})
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if(!conta){
        return res.status(404).json({mensagem: 'Conta não encontrada.'})
    }

    const cpfExiste = contas.find((usuario) =>{
            
        const cpfDoBanco = usuario.usuario.cpf
        
        return cpf === cpfDoBanco;
    })
    if(cpfExiste){
        return res.status(400).json({mensagem: "O CPF informado já existe cadastrado!"});
    }

    const emailExiste = contas.find((usuario) =>{
            
        const emailDoBanco = usuario.usuario.email
        
        return email === emailDoBanco;
    })
    if(emailExiste){
        return res.status(400).json({mensagem: "O email informado já existe cadastrado!"});
    }
     
    try{
        conta.usuario.nome = nome,
        conta.usuario.cpf = cpf,
        conta.usuario.data_nascimento = data_nascimento,
        conta.usuario.telefone = telefone,
        conta.usuario.email = email,
        conta.usuario.senha = senha
    
        return res.status(200).json();
    
    }catch (erro) {
        return res.status(500).json('Erro de servidor')
    }
}

const excluirConta = async (req, res) => {
    const {numeroConta} = req.params;
    
    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });
    if(!conta){
        return res.status(404).json({mensagem: 'Conta não encontrada.'})
    }

    if(conta.saldo !== 0){
        return res.status(404).json({mensagem: 'A conta só pode ser removida se o saldo for zero!'});
    }

    try{
        contas = contas.filter((conta) => {
            return conta.numero !== Number(numeroConta);
        })
    
        return res.status(200).send();
    }catch (erro) {
        return res.status(500).json('Erro de servidor')
    }
}

const depositar = async (req, res) => {
   
    const { numero_conta, valor } = req.body;
    
    if(!numero_conta && !valor){
        return res.status(400).json({mensagem: 'O número da conta e o valor são obrigatórios!'})
    }
    
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });
    if(!conta){
        return res.status(404).json({mensagem: 'Conta não encontrada.'})
    }

    if(valor <=0){
        return res.status(404).json({mensagem: 'Valor inserido invalido!'})
    }

    try{
        conta.saldo = valor + conta.saldo
    
    depositos.push({
      data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      numero_conta: conta.numero,
      valor
    })

    return res.status(200).send();
    
    }catch (erro) {
        return res.status(500).json('Erro de servidor')
    }
    
}

const sacar = async (req, res) =>{
    const { numero_conta, valor, senha } = req.body;
    
    if(!numero_conta && !valor && !senha){
        return res.status(400).json({mensagem: 'O número da conta e o valor são obrigatórios!'})
    }
    
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });
    if(!conta){
        return res.status(404).json({mensagem: 'Conta não encontrada.'})
    }

    if(valor <=0){
        return res.status(404).json({mensagem: 'O valor não pode ser menor que zero!'})
    }

    if(senha !== conta.usuario.senha){
        return res.status(404).json({mensagem: 'Senha invalida!'})
    }

    if(valor > conta.saldo){
        return res.status(404).json({mensagem: 'Saldo insuficiente!'})
    }
    
    try{
        conta.saldo = conta.saldo - valor

    saques.push({
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta: conta.numero,
        valor
      })

      return res.status(200).send();

    }catch (erro) {
        return res.status(500).json('Erro de servidor')
    }
    
}

const transferir = async (req, res) => {
    const {  numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if(!numero_conta_origem && !valor && !senha && !numero_conta_destino){
        return res.status(400).json({mensagem: 'Todos os campos são obrigatórios!'})
    }
    
    const contaOrigem = contas.find((contaOrigem) => {
        return contaOrigem.numero === Number(numero_conta_origem);
    });
    if(!contaOrigem){
        return res.status(404).json({mensagem: 'Sua conta não foi encontrada.'})
    }

    const contaDestino = contas.find((contaDestino) => {
        return contaDestino.numero === Number(numero_conta_destino);
    });
    if(!contaDestino){
        return res.status(404).json({mensagem: 'A conta de destino não encontrada.'})
    }

    if(valor <=0){
        return res.status(404).json({mensagem: 'O valor não pode ser menor que zero!'})
    }

    if(senha !== contaOrigem.usuario.senha){
        return res.status(404).json({mensagem: 'Senha invalida!'})
    }

    if(valor > contaOrigem.saldo){
        return res.status(404).json({mensagem: 'Saldo insuficiente!'})
    }
    
    try{
        contaDestino.saldo = contaDestino.saldo + valor
        contaOrigem.saldo = contaOrigem.saldo - valor

    transferencias.push({
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem: contaOrigem.numero,
        numero_conta_destino: contaDestino.numero,
        valor
    })

    return res.status(200).json();

    }catch (erro) {
        return res.status(500).json('Erro de servidor')
    }
}

const saldoConta = async (req, res) =>{
    const conta = res.locals.conta 

    try{
        return res.status(200).json({saldo: conta.saldo});
    }catch (erro) {
        return res.status(500).json('Erro de servidor')
    }
}

const extratoConta = async (req, res) =>{
    const conta = res.locals.conta 
    const {numero_conta, senha} = req.query;
    
    try{
        const deposito = depositos.filter((deposito) => {
            return deposito.numero_conta === Number(numero_conta);
        });
        
        const saque = saques.filter((saque) => {
            return saque.numero_conta === Number(numero_conta);
        });
        
        const transferenciaEnviada = transferencias.filter((transferencia) => {
            
            return transferencia.numero_conta_origem === Number(numero_conta);
        });
        
        const transferenciaRecebida = transferencias.filter((transferencia) => {
            return transferencia.numero_conta_destino === Number(numero_conta);
        });
        
        return res.status(200).json({
            depositos: deposito,
            saques: saque,
            transferenciasEnviadas: transferenciaEnviada,
            transferenciasRecebidas: transferenciaRecebida
        });

    }catch (erro) {
        return res.status(500).json('Erro de servidor')
    }
    
}


module.exports = {
    listarContas,
    criarConta,
    atualizarUsuarioDaConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldoConta,
    extratoConta
};