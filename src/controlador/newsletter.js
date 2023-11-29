const transportador = require("../conexoes/nodemailer")
const knex = require("../conexoes/postgres")
const compiladorHtml = require("../utils/compiladorHtml")

const cadastrarEmail = async (req, res)=>{
    const {nome, email} = req.body
    
    try {
        const usuarioExistente = await knex('emails')
  .where({ email })
  .orWhere({ nome })
  .first();

if (usuarioExistente) {
  return res.status(400).json({ mensagem: 'Email ou nome já cadastrados' });
}

      await knex('emails').insert({
        nome,
        email,
      })
        return res.status(201).json('Cadastro foi efetuado com sucesso')
        
    } catch (error) {
        return res.status(500).json({mensagem:'Erro interno do servidor'})
        
    }
}

const enviarNewsletter = async (req, res)=>{
    const {texto} = req.body
    try {
        const emails = await knex('emails')
       

        for (const email of emails) {
            const htmlNewsletter = await compiladorHtml('./src/templates/newsLetter.html',{
            usuario:email.nome,
            texto
            })
            transportador.sendMail({
                from:`${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
                to: `${email.nome} <${email.email}>`,
                subject:'newsletter cubos academy',
                html:htmlNewsletter
            })
        }
        return res.status(204).send()
    } catch (error) {
        
        return res.status(500).json({mensagem:'Erro interno do servidor'})
    }
}

module.exports ={
    cadastrarEmail,
    enviarNewsletter
}