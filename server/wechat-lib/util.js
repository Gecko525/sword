import xml2js from 'xml2js'
import template from './template'

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

function formatMsg(data) {
  if (typeof data !== 'object') {
    return data
  }
  let message
  // 判断是否是数组
  if (data instanceof Array) {
    if (data.length <= 1) {
      message = data[0].trim() || ''
    } else {
      message = []
      data.forEach((d, i) => {
        message.push(formatMsg(d))
      })
    }
  } else {
    // 对象
    message = {}
    const keys = Object.keys(data)
    keys.forEach((key, index) => {
      message[key] = formatMsg(data[key])
    })
  }

  return message
}

function tpl(content, msg) {
  let type = 'text'
  let info

  const commonInfo = {
    createTime: new Date().getTime(),
    msgType: content.type || type,
    toUserName: msg.FromUserName,
    fromUserName: msg.ToUserName
  }

  if (typeof content !== 'object') {
    content = content || 'Empty News'
    info = Object.assign(commonInfo, {content})
  } else if (Array.isArray(content)) {
    // conent为数组，类型为news
    type = 'news'
    info = Object.assign(commonInfo, {
      msgType: type,
      articleCount: content.length,
      news: content
    })
  } else {
    // 对象
    info = Object.assign(commonInfo, content)
  }

  return template(info)
}

export {
  parseXML,
  formatMsg,
  tpl
}
