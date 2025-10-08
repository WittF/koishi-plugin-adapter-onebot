# @wittf/koishi-plugin-adapter-onebot

适用于 [Koishi](https://koishi.chat/) 的 OneBot 适配器（含 NapCat 扩展）。

[OneBot](https://github.com/howmanybots/onebot) 是一个聊天机器人应用接口标准。

本适配器在标准 OneBot 协议基础上，扩展支持 [NapCat](https://napcat.napneko.icu/) 提供的非标准 API 和事件。

## NapCat 扩展

### 扩展事件

#### 群表情回应事件

<details>
<summary>监听群消息的表情回应</summary>

```typescript
ctx.on('internal/session', (session) => {
  if (session.type === 'notice' && session.subtype === 'group-msg-emoji-like') {
    const data = session.onebot
    console.log('消息ID:', data.message_id)
    console.log('回应用户:', data.user_id)
    console.log('群号:', data.group_id)
    console.log('表情列表:', data.likes)
    // likes: [{ emoji_id: '107', count: 1 }, ...]
  }
})
```

</details>

### 扩展 API

#### 账号相关 (6)

- `bot.internal.setSelfLongnick(longNick)` - 设置个性签名
- `bot.internal.setOnlineStatus(status, ext_status, battery_status)` - 设置在线状态
- `bot.internal.setQqProfile(nickname, company, email, college, personal_note)` - 设置 QQ 资料
- `bot.internal.setQqAvatar(file)` - 设置 QQ 头像
- `bot.internal.getClientkey()` - 获取客户端密钥
- `bot.internal.setInputStatus(user_id, event_type)` - 设置输入状态

#### 好友相关 (9)

- `bot.internal.markPrivateMsgAsRead(user_id)` - 标记私聊消息已读
- `bot.internal.getFriendMsgHistory(user_id, message_seq, count, reverseOrder)` - 获取私聊消息历史
- `bot.internal.friendPoke(user_id)` - 好友戳一戳
- `bot.internal.fetchEmojiLike(user_id)` - 获取表情点赞信息
- `bot.internal.getFriendsWithCategory()` - 获取分类好友列表
- `bot.internal.getUnidirectionalFriendList()` - 获取单向好友列表
- `bot.internal.deleteFriend(user_id)` - 删除好友
- `bot.internal.forwardFriendSingleMsg(message_id, user_id)` - 转发单条好友消息
- `bot.internal.ncGetUserStatus(user_id)` - 获取用户状态

#### 群组相关 (11)

- `bot.internal.markGroupMsgAsRead(group_id)` - 标记群消息已读
- `bot.internal.groupPoke(group_id, user_id)` - 群内戳一戳
- `bot.internal.getGroupShutList(group_id)` - 获取群禁言列表
- `bot.internal.setGroupRemark(group_id, remark)` - 设置群备注
- `bot.internal.forwardGroupSingleMsg(message_id, group_id)` - 转发单条群消息
- `bot.internal.getGroupInfoEx(group_id)` - 获取群扩展信息
- `bot.internal.setGroupPortrait(group_id, file, cache)` - 设置群头像
- `bot.internal.sendGroupNotice(group_id, content, image)` - 发送群公告
- `bot.internal.getGroupNotice(group_id)` - 获取群公告
- `bot.internal.getGroupAtAllRemain(group_id)` - 获取 @全体成员 剩余次数
- `bot.internal.setGroupSign(group_id)` - 群签到

#### 消息相关 (4)

- `bot.internal.setMsgEmojiLike(message_id, emoji_id)` - 设置表情回应
- `bot.internal.markAllAsRead()` - 标记所有消息已读
- `bot.internal.getRecentContact(count)` - 获取最近联系人
- `bot.internal.ocrImage(image)` - 图片 OCR 识别

#### 文件相关 (7)

- `bot.internal.uploadGroupFile(group_id, file, name, folder)` - 上传群文件
- `bot.internal.deleteGroupFile(group_id, file_id, busid)` - 删除群文件
- `bot.internal.getGroupFileSystemInfo(group_id)` - 获取群文件系统信息
- `bot.internal.getGroupRootFiles(group_id)` - 获取群根目录文件列表
- `bot.internal.getGroupFilesByFolder(group_id, folder_id)` - 获取群子目录文件列表
- `bot.internal.getGroupFileUrl(group_id, file_id, busid)` - 获取群文件链接
- `bot.internal.uploadPrivateFile(user_id, file, name)` - 上传私聊文件

#### AI 相关 (3)

- `bot.internal.aiTextToImage(chat_type, prompt, model_index)` - AI 文本转图片
- `bot.internal.aiSummarizeChat(group_id)` - AI 总结聊天记录
- `bot.internal.aiVoiceToText(file_id)` - AI 语音转文字

> 完整 API 类型定义见 [src/types.ts](./src/types.ts)

### 表情工具函数

提供 QQ 表情查询和随机选择功能（260 个可用表情）。

<details>
<summary>使用示例</summary>

```typescript
import { getRandomEmoji, getAllEmojis, getEmojiById, getEmojiByName } from '@wittf/koishi-plugin-adapter-onebot'

// 获取随机表情（从260个QQ表情中）
const emoji = getRandomEmoji()
console.log(emoji.id, emoji.name)  // '107' 'doge'

// 获取所有可用表情
const allEmojis = getAllEmojis()

// 根据 ID 查找
const doge = getEmojiById('107')

// 根据名称查找
const smile = getEmojiByName('微笑')
```

表情对象结构：
```typescript
interface QQEmoji {
  id: string        // 表情 ID，用于 setMsgEmojiLike
  name: string      // 表情名称（已去除 / 前缀）
  QSid?: string     // 原始 QQ 表情 ID
  QDes?: string     // 原始描述
  IQLid?: string    // iOS QQ 表情 ID
  AQLid?: string    // Android QQ 表情 ID
  EMCode?: string   // 表情代码
  Input?: string[]  // 输入提示
}
```

</details>

### 使用示例

<details>
<summary>在其他插件中使用 NapCat 功能</summary>

```typescript
import { Context } from 'koishi'
import { getRandomEmoji } from '@wittf/koishi-plugin-adapter-onebot'

export function apply(ctx: Context) {
  // 调用 NapCat API
  ctx.command('poke <user:user>')
    .action(async ({ session }, user) => {
      const bot = session.bot as any
      if (session.guildId) {
        await bot.internal.groupPoke(session.guildId, user)
      } else {
        await bot.internal.friendPoke(user)
      }
      return '已戳一戳~'
    })

  // 使用表情工具
  ctx.command('random-react')
    .action(async ({ session }) => {
      const bot = session.bot as any
      const emoji = getRandomEmoji()
      if (session.quote) {
        await bot.internal.setMsgEmojiLike(session.quote.id, emoji.id)
        return `已用 /${emoji.name}/ 回应~`
      }
      return '请引用要回应的消息'
    })

  // 监听扩展事件
  ctx.on('internal/session', (session) => {
    if (session.type === 'notice' && session.subtype === 'group-msg-emoji-like') {
      const data = session.onebot
      console.log(`收到表情回应: ${data.message_id}`)
    }
  })
}
```

</details>

## 内部 API

你可以通过 `bot.internal` 或 `session.onebot` 访问内部 API，参见 [访问内部接口](https://koishi.chat/zh-CN/guide/adapter/bot.html#internal-access)。

### OneBot v11 标准 API

- [`onebot.sendPrivateMsg()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#send_private_msg-发送私聊消息)
- [`onebot.sendGroupMsg()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#send_group_msg-发送群消息)
- [`onebot.deleteMsg()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#delete_msg-撤回消息)
- [`onebot.getMsg()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_msg-获取消息)
- [`onebot.getForwardMsg()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_forward_msg-获取合并转发消息)
- [`onebot.sendLike()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#send_like-发送好友赞)
- [`onebot.setGroupKick()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_kick-群组踢人)
- [`onebot.setGroupBan()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_ban-群组单人禁言)
- [`onebot.setGroupAnonymousBan()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_anonymous_ban-群组匿名用户禁言)
- [`onebot.setGroupWholeBan()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_whole_ban-群组全员禁言)
- [`onebot.setGroupAdmin()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_admin-群组设置管理员)
- [`onebot.setGroupAnonymous()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_anonymous-群组匿名)
- [`onebot.setGroupCard()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_card-设置群名片群备注)
- [`onebot.setGroupName()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_name-设置群名)
- [`onebot.setGroupLeave()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_leave-退出群组)
- [`onebot.setGroupSpecialTitle()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_special_title-设置群组专属头衔)
- [`onebot.setFriendAddRequest()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_friend_add_request-处理加好友请求)
- [`onebot.setGroupAddRequest()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_group_add_request-处理加群请求邀请)
- [`onebot.getLoginInfo()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_login_info-获取登录号信息)
- [`onebot.getStrangerInfo()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_stranger_info-获取陌生人信息)
- [`onebot.getFriendList()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_friend_list-获取好友列表)
- [`onebot.getGroupInfo()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_group_info-获取群信息)
- [`onebot.getGroupList()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_group_list-获取群列表)
- [`onebot.getGroupMemberInfo()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_group_member_info-获取群成员信息)
- [`onebot.getGroupMemberList()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_group_member_list-获取群成员列表)
- [`onebot.getGroupHonorInfo()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_group_honor_info-获取群荣誉信息)
- [`onebot.getCookies()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_cookies-获取-cookies)
- [`onebot.getCsrfToken()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_csrf_token-获取-csrf-token)
- [`onebot.getCredentials()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_credentials-获取-qq-相关接口凭证)
- [`onebot.getRecord()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_record-获取语音)
- [`onebot.getImage()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_image-获取图片)
- [`onebot.canSendImage()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#can_send_image-检查是否可以发送图片)
- [`onebot.canSendRecord()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#can_send_record-检查是否可以发送语音)
- [`onebot.getStatus()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_status-获取运行状态)
- [`onebot.getVersionInfo()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_version_info-获取版本信息)
- [`onebot.setRestart()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#set_restart-重启-onebot-实现)
- [`onebot.cleanCache()`](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#clean_cache-清理缓存)

### go-cqhttp 扩展 API

- [`onebot.sendGroupForwardMsg()`](https://docs.go-cqhttp.org/api/#发送合并转发-群聊)
- [`onebot.markMsgAsRead()`](https://docs.go-cqhttp.org/api/#标记消息已读)
- [`onebot.sendGroupSign()`](https://docs.go-cqhttp.org/api/#群打卡)
- [`onebot.qidianGetAccountInfo()`](https://docs.go-cqhttp.org/api/#获取企点账号信息)
- [`onebot.setQqProfile()`](https://docs.go-cqhttp.org/api/#设置登录号资料)
- [`onebot.getUnidirectionalFriendList()`](https://docs.go-cqhttp.org/api/#获取单向好友列表)
- [`onebot.deleteFriend()`](https://docs.go-cqhttp.org/api/#删除好友)
- [`onebot.setGroupPortrait()`](https://docs.go-cqhttp.org/api/#设置群头像)
- [`onebot.getWordSlices()`](https://docs.go-cqhttp.org/api/#获取中文分词-隐藏-api)
- [`onebot.ocrImage()`](https://docs.go-cqhttp.org/api/#图片-ocr)
- [`onebot.getGroupSystemMsg()`](https://docs.go-cqhttp.org/api/#获取群系统消息)
- [`onebot.uploadPrivateFile()`](https://docs.go-cqhttp.org/api/#上传私聊文件)
- [`onebot.uploadGroupFile()`](https://docs.go-cqhttp.org/api/#上传群文件)
- [`onebot.getGroupFileSystemInfo()`](https://docs.go-cqhttp.org/api/#获取群文件系统信息)
- [`onebot.getGroupRootFiles()`](https://docs.go-cqhttp.org/api/#获取群根目录文件列表)
- [`onebot.getGroupFilesByFolder()`](https://docs.go-cqhttp.org/api/#获取群子目录文件列表)
- [`onebot.createGroupFileFolder()`](https://docs.go-cqhttp.org/api/#创建群文件文件夹)
- [`onebot.deleteGroupFolder()`](https://docs.go-cqhttp.org/api/#删除群文件文件夹)
- [`onebot.deleteGroupFile()`](https://docs.go-cqhttp.org/api/#删除群文件)
- [`onebot.getGroupFileUrl()`](https://docs.go-cqhttp.org/api/#获取群文件资源链接)
- [`onebot.getGroupAtAllRemain()`](https://docs.go-cqhttp.org/api/#获取群-全体成员-剩余次数)
- [`onebot.getVipInfo()`](https://github.com/Mrs4s/go-cqhttp/blob/master/docs/cqhttp.md?plain=1#L1081)
- [`onebot.sendGroupNotice()`](https://docs.go-cqhttp.org/api/#发送群公告)
- [`onebot.getGroupNotice()`](https://docs.go-cqhttp.org/api/#获取群公告)
- [`onebot.reloadEventFilter()`](https://docs.go-cqhttp.org/api/#重载事件过滤器)
- [`onebot.downloadFile()`](https://docs.go-cqhttp.org/api/#下载文件到缓存目录)
- [`onebot.getOnlineClients()`](https://docs.go-cqhttp.org/api/#获取当前账号在线客户端列表)
- [`onebot.getGroupMsgHistory()`](https://docs.go-cqhttp.org/api/#获取群消息历史记录)
- [`onebot.setEssenceMsg()`](https://docs.go-cqhttp.org/api/#设置精华消息)
- [`onebot.deleteEssenceMsg()`](https://docs.go-cqhttp.org/api/#移出精华消息)
- [`onebot.getEssenceMsgList()`](https://docs.go-cqhttp.org/api/#获取精华消息列表)
- [`onebot.checkUrlSafely()`](https://docs.go-cqhttp.org/api/#检查链接安全性)
- [`onebot.getModelShow()`](https://docs.go-cqhttp.org/api/#获取在线机型)
- [`onebot.setModelShow()`](https://docs.go-cqhttp.org/api/#设置在线机型)
- [`onebot.delete_unidirectional_friend()`](https://docs.go-cqhttp.org/api/#删除单向好友)
- [`onebot.send_private_forward_msg()`](https://docs.go-cqhttp.org/api/#发送合并转发-好友)

### 频道 API

- [`onebot.getGuildServiceProfile()`](https://docs.go-cqhttp.org/api/guild.html#获取频道系统内bot的资料)
- [`onebot.getGuildList()`](https://docs.go-cqhttp.org/api/guild.html#获取频道列表)
- [`onebot.getGuildMetaByGuest()`](https://docs.go-cqhttp.org/api/guild.html#通过访客获取频道元数据)
- [`onebot.getGuildChannelList()`](https://docs.go-cqhttp.org/api/guild.html#获取子频道列表)
- [`onebot.getGuildMembers()`](https://docs.go-cqhttp.org/api/guild.html#获取频道成员列表)
- [`onebot.sendGuildChannelMsg()`](https://docs.go-cqhttp.org/api/guild.html#发送信息到子频道)

## 许可证

使用 [MIT](./LICENSE) 许可证发布。

```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
