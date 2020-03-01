export default function template(info) {
  info = Object.assign({
    content: '',
    mediaId: '',
    title: '',
    description: '',
    musicUrl: '',
    hqMusicUrl: '',
    thumbMeidaId: '',
    articleCount: 0,
    news: []
  }, info)
  console.log(info)
  const commonTpl = `
      <ToUserName><![CDATA[${info.toUserName}]]></ToUserName>
      <FromUserName><![CDATA[${info.fromUserName}]]></FromUserName>
      <CreateTime><![CDATA[${info.createTime}]]></CreateTime>
      <MsgType><![CDATA[${info.msgType}]]></MsgType>
  `
  const typeTpl = {
    text: `<Content><![CDATA[${info.content}]]></Content>`,
    image: `
      <Image>
        <MediaId><![CDATA[${info.mediaId}]]></MediaId>
      </Image>
    `,
    voice: `
      <Voice>
        <MediaId><![CDATA[${info.mediaId}]]></MediaId>
      </Voice>
    `,
    video: `
      <Video>
        <MediaId><![CDATA[${info.mediaId}]]></MediaId>
        <Title><![CDATA[${info.title}]]></Title>
        <Description><![CDATA[${info.description}]]></Description>
      </Video>
    `,
    music: `
      <Music>
        <Title><![CDATA[${info.title}]]></Title>
        <Description><![CDATA[${info.description}]]></Description>
        <MusicUrl><![CDATA[${info.musicUrl}]]></MusicUrl>
        <HQMusicUrl><![CDATA[${info.hqMusicUrl}]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[${info.thumbMeidaId}]]></ThumbMediaId>
      </Music>
    `,
    news: (() => {
      return `<ArticleCount>${info.articleCount}</ArticleCount>` +
      info.news.map((news) => {
        return `<Articles>
                  <item>
                    <Title><![CDATA[${news.title}]]></Title>
                    <Description><![CDATA[${news.description}]]></Description>
                    <PicUrl><![CDATA[${news.picUrl}]]></PicUrl>
                    <Url><![CDATA[${news.url}]]></Url>
                  </item>
                </Articles>`
      }).join()
    })()
  }
  const tpl = `<xml>${commonTpl + typeTpl[info.msgType]}</xml>`
  return tpl
}
