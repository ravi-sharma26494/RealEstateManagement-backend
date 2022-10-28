const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keysecret = 'RESTAPI'
const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
})
// hashing  password
LoginSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12)
    this.cpassword = await bcrypt.hash(this.cpassword, 12)
  }
  next()
})

// token generating
LoginSchema.methods.generateAuthtoken = async function () {
  try {
    let token23 = jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: '1d'
    })

    this.tokens = this.tokens.concat({ token: token23 })
    await this.save()
    return token23
  } catch (error) {
    res.status(422).json(error)
  }
}
const Login = mongoose.model('Login', LoginSchema)
module.exports = Login
