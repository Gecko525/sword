import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'

export default function (opts, reply) {
  return async function (ctx, next) {
    console.log('接收到微信服务器请求。。。。')
    const token = opts.token
    const {signature, timestamp, nonce, echostr} = ctx.query
    const newStr = [token, timestamp, nonce].sort().join('')
    const sha = sha1(newStr)
    if (!signature === sha) {
      ctx.body = 'Failed'
      return false
    }
    if (ctx.method === 'GET') {
      ctx.body = echostr
    } else if (ctx.method === 'POST') {
      const data = await getRawBody(ctx.req, {
        length: ctx.req.length,
        limit: '1mb',
        encoding: ctx.charset
      })
      const content = await util.parseXML(data)
      // {
      //   xml: {
      //     ToUserName: [ 'gh_8e1a8777b838' ],
      //     FromUserName: [ 'og9skw59zMsHQbrvVdATMuyrhmLA' ],
      //     CreateTime: [ '1579086167' ],
      //     MsgType: [ 'text' ],
      //     Content: [ '1' ],
      //     MsgId: [ '22607076963758887' ]
      //   }
      // }
      // 获取xml数据
      const message = util.formatMsg(content.xml)
      ctx.weixin = message
      console.log(message)

      // 获取回复数据
      await reply.apply(ctx, [ctx, next])
      const replyBody = ctx.body
      const reciveMsg = ctx.weixin

      // 将回复数据套进xml模板
      const xml = util.tpl(replyBody, reciveMsg)
      // const xml = `
      //   <xml>
      //     <ToUserName><![CDATA[${content.xml.FromUserName[0]}]]></ToUserName>
      //     <FromUserName><![CDATA[${content.xml.ToUserName[0]}]]></FromUserName>
      //     <CreateTime><![CDATA[${(new Date().getTime()).toString()}]]></CreateTime>
      //     <MsgType><![CDATA[text]]></MsgType>
      //     <Content><![CDATA[${ctx.body}]]></Content>
      //   </xml>
      // `
      console.log(xml)
      ctx.status = 200
      ctx.type = 'application/xml'
      ctx.body = xml
    }
  }
}
