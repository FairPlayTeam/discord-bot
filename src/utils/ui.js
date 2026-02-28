import {
	ActionRowBuilder,
	TextDisplayBuilder,
	TextInputBuilder,
	LabelBuilder,
	TextInputStyle,
} from 'discord.js'
import {
	LANG,
	SERVERS,
} from '../constants.js'
import { GlobalFonts } from '@napi-rs/canvas'

function wrapInRow(...components) {
	return new ActionRowBuilder().addComponents(...components)
}

function extractLang(customId, startIndex = -1) {
	const parts = customId.split(/[-$]/)
	return parts[parts.length + startIndex] || LANG.DEFAULT
}

function createChannelLink(channelId, guildId = SERVERS.STABLE) {
	return `https://discord.com/channels/${guildId}/${channelId}`
}

function loadFont(name, path) {
	GlobalFonts.registerFromPath(path, name)
}

function formatText(text) {
	return new TextDisplayBuilder().setContent(text)
}

function findMenuSelectionFromInteraction (interaction) {
	return interaction.values[0]
}

const createTextInputLabel = (customId, style, placeholder, title, { description, isRequired = false, minLength, maxLength }) => {
	const textInput = new TextInputBuilder()
		.setCustomId(customId)
		.setStyle(style === 'short' ? TextInputStyle.Short : TextInputStyle.Paragraph)
		.setPlaceholder(placeholder)

	if (isRequired) {
		textInput.setRequired(true)
	}

	if (minLength) {
		textInput.setMinLength(minLength)
	}

	if (maxLength) {
		textInput.setMaxLength(maxLength)
	}

	const textLabel = new LabelBuilder()
		.setLabel(title)
		.setTextInputComponent(textInput)

	if (description) {
		textLabel.setDescription(description)
	}

	return textLabel
}

export {
	wrapInRow,
	extractLang,
	createChannelLink,
	loadFont,
	formatText,
	findMenuSelectionFromInteraction,
	createTextInputLabel,
}