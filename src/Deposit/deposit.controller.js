'use strict'

const Deposit = require('./deposit.model')
const User = require('../user/user.model')

exports.test = (req, res) => {
  res.send({ message: 'Funcion de prueba' })
  console.log(Date())
}

exports.addDeposito = async (req, res) => {
  try {
    let data = req.body;
    let existNoCuenta = await User.findOne({ nocuenta: data.noCuenta });
    if (!existNoCuenta) return res.status(400).send({ message: 'No encontrado' });
    //Creo mi varible que almacenara la suma de mi balance con el monto 
    let newSaldo = existNoCuenta.balance + Number(data.amount);
    let updateAcound = await User.findOneAndUpdate({ nocuenta: data.noCuenta }, { balance: newSaldo }, { new: true });
    console.log(newSaldo)
    let deposito = new Deposit(data);
    await deposito.save();
    return res.send({ message: 'Deposito exitoso' })


  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'No se puede completar el deposito' })
  }
};

exports.getDeposits = async (req, res) => {
  //Buscar
  try {
    let deposit = await Deposit.find();
    return res.send({message: 'Deposit found', deposit})

  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error getting Deposits' })
  }
}

exports.getDeposit = async(req, res)=>{
  try {
    let depositId = req.params.id;
    let deposit = await Deposit.findOne({_id: depositId});
    if(!deposit) return res.status(404).send({message: 'Deposit not found'})
    return res.send({message: 'Deposit found', deposit});
  } catch (err) {
    console.error(err)
    return res.status(500).send({message: 'Error getting Deposit'})
  }
}








