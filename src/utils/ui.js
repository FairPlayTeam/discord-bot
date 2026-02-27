import {
  ActionRowBuilder,
	TextDisplayBuilder,
} from 'discord.js'
import {
  LANG,
  SERVERS,
} from '../constants.js'
import { GlobalFonts } from '@napi-rs/canvas'

export function wrapInRow(...components) {
  return new ActionRowBuilder().addComponents(...components)
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

export function formatText(text) {
	return new TextDisplayBuilder().setContent(text)
}

export function findMenuSelectionFromInteraction (interaction) {
	return interaction.values[0]
}