import Wechat from '../wechat-lib'
import config from '../config'
import Token from '../database/schema/token'

const wechatConfig = {
  wechat: Object.assign(config.wechat, {
    getAccessToken: async () => {
      const token = await Token.getAccessToken()
      return token
    },
    saveAccessToken: async (token) => {
      const res = await Token.saveAccessToken(token)
      return res
    }
  })
}

export const getWechat = () => {
  const wechatClient = new Wechat(wechatConfig.wechat)
  return wechatClient
}
