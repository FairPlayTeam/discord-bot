import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	ContainerBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js"

import {
	formatText,
	wrapInRow,
} from '../utils/ui.js'

import {
	t,
	getLangFromInteraction
} from '../i18n/index.js'

import {
	EMOJIS,
	LANG,
} from '../constants.js'

export const data = new SlashCommandBuilder()
	.setName('rules_show_container')
	.setDescription('Shows the server rules where the command is executed')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export function generateRules(actualLang = LANG.DEFAULT) {
	const texts = JSON.parse(t(actualLang, 'commands.rules_show.texts'))

	const separators = [
		new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small),
		new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
	]

	const acceptRules = new ButtonBuilder()
		.setLabel('I read and understood the rules')
		.setCustomId('rules_accept')
		.setEmoji(EMOJIS.CHECK)
		.setStyle(ButtonStyle.Success)

	const frButton = new ButtonBuilder()
		.setLabel('Français')
		.setCustomId('rules_change_lang')
		.setEmoji(EMOJIS.FLAG_FR)
		.setStyle(ButtonStyle.Primary)

	const container = new ContainerBuilder()
		.addTextDisplayComponents(formatText(texts[0]))
		.addSeparatorComponents(separators[1])
		.addTextDisplayComponents(formatText(texts[1]))
		.addSeparatorComponents(separators[0])
		.addTextDisplayComponents(formatText(texts[2]))
		.addSeparatorComponents(separators[0])
		.addTextDisplayComponents(formatText(texts[3]))
		.addSeparatorComponents(separators[0])
		.addTextDisplayComponents(formatText(texts[4]))
		.addSeparatorComponents(separators[0])
		.addTextDisplayComponents(formatText(texts[5]))
		.addSeparatorComponents(separators[1])
		.addTextDisplayComponents(formatText(texts[6]))
		.addSeparatorComponents(separators[1])
		.addActionRowComponents(wrapInRow(frButton))
		.addSeparatorComponents(separators[1])
		.addActionRowComponents(wrapInRow(acceptRules))

	return container
}

export async function execute(interaction) {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral })
	
	const lang = getLangFromInteraction(interaction)

	const container = this.generateRules(LANG.EN)

	await interaction.channel.send({
		flags: MessageFlags.IsComponentsV2,
		components: [container]
	})

	await interaction.editReply(t(lang, 'commands.tickets_show.sent'))
}