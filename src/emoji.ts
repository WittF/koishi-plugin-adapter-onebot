import emojiData from './emoji-data.json'

export interface QQEmoji {
  id: string
  name: string
  QSid?: string
  QDes?: string
  IQLid?: string
  AQLid?: string
  EMCode?: string
  Input?: string[]
}

let cachedEmojiList: QQEmoji[]

export const getAllEmojis = (): QQEmoji[] => {
  if (cachedEmojiList) return cachedEmojiList
  cachedEmojiList = emojiData
    .filter((e: any) => e.QSid && e.QDes && !e.QHide)
    .map((e: any) => ({
      id: e.QSid,
      name: e.QDes.replace(/^\//, ''),
      ...e,
    }))
  return cachedEmojiList
}

export const getRandomEmoji = (): QQEmoji => {
  const list = getAllEmojis()
  return list[Math.floor(Math.random() * list.length)]
}

export const getEmojiById = (id: string): QQEmoji | undefined => {
  return getAllEmojis().find(emoji => emoji.id === id)
}

export const getEmojiByName = (name: string): QQEmoji | undefined => {
  const normalizedName = name.replace(/^\//, '')
  return getAllEmojis().find(emoji => emoji.name === normalizedName)
}
