import axios from 'axios'

const api = {
  accessToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential'
}

export default class Wechat {
  constructor(opts) {
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.fecthAccessToken()
  }

  async fecthAccessToken() {
    console.log('fetch token')
    let token = await this.getAccessToken()
    if (!this.isValidAccessToken(token)) {
      token = await this.updateAccessToken()
      await this.saveAccessToken(token)
    }
    return token
  }

  async updateAccessToken() {
    console.log('update token')
    const url = `${api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`
    let data
    try {
      data = await axios.get(url)
    } catch (error) {
      console.log(error)
    }
    const now = new Date().getTime()
    const expiresIn = now + (data.data.expires_in - 20) * 1000

    data.data.expires_in = expiresIn
    return data.data
  }

  isValidAccessToken(token) {
    if (!token || !token.access_token || !token.expires_in) {
      return false
    }
    const expiresIn = token.expires_in
    const now = new Date().getTime()
    console.log('valid', now < expiresIn)
    return now < expiresIn
  }
}
