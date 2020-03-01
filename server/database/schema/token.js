import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema({
  name: String,
  token: String,
  expires_in: Number,
  meta: {
    created: {
      type: Date,
      default: Date.now()
    },
    updated: {
      type: Date,
      default: Date.now()
    }
  }
})

TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.created = this.meta.updated = Date.now()
  } else {
    this.meta.updated = Date.now()
  }
  next()
})

TokenSchema.statics = {
  async getAccessToken() {
    console.log('find one')
    const token = await this.findOne({
      name: 'access_token'
    })
    if (token && token.token) {
      token.access_token = token.token
    }
    return token
  },
  async saveAccessToken(data) {
    let token = await this.findOne({
      name: 'access_token'
    })
    if (token) {
      token.token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new Token({
        name: 'access_token',
        token: data.access_token,
        expires_in: data.expires_in
      })
    }

    await token.save()
    return data
  }
}
// model 必须在注册完statics后执行，否则无法添加静态方法
const Token = mongoose.model('Token', TokenSchema)
export default Token
