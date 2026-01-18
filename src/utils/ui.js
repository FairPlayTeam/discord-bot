import { ActionRowBuilder } from 'discord.js'
import {
  LANG,
  SERVERS,
} from '../constants.js'
import { GlobalFonts } from '@napi-rs/canvas'

export function wrapInRow(component) {
  return new ActionRowBuilder().addComponents(component)
}

export function extractLang(customId, startIndex = -1) {
  const parts = customId.split(/[-$]/)
  return parts[parts.length + startIndex] || LANG.DEFAULT
}

export function createChannelLink(channelId, guildId = SERVERS.STABLE) {
  return `https://discord.com/channels/${guildId}/${channelId}`
}

export function loadFont(name, path) {
  GlobalFonts.registerFromPath(path, name)
}