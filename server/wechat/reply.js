export default function reply(ctx, next) {
  const msg = ctx.weixin
  if (msg.MsgType === 'text' && msg.Content === '武功秘籍') {
    ctx.body = [
      {
        title: '绝世武功大全',
        description: '金庸武侠世界中最厉害的绝世武功排行榜',
        picUrl: 'http://www.ttpaihang.com/image/vote/20120827115435434285.jpg',
        url: 'http://www.ttpaihang.com/vote/rank.php?voteid=1110'
      }
    ]
  } else if (msg.MsgType === 'event') {
    if (msg.Event === 'subscribe') {
      ctx.body = '感谢你这么漂亮还来关注我'
      console.log('关注了')
    } else if (msg.Event === 'unsubscribe') {
      ctx.body = 'unsubscribe'
      console.log('取消关注了')
    }
  } else {
    ctx.body = `这个人家还不会呢，不如回复 “武功秘籍” 试试`
  }
}
