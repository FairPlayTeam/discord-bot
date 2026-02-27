import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	ContainerBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
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

export async function generateRules(actualLang = LANG.DEFAULT) {
	const texts = JSON.parse(t(actualLang, 'commands.rules_show.texts'))

	const separators = [
		new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small),
		new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
	]

	const options = [
		new StringSelectMenuOptionBuilder()
			.setLabel('English')
			.setValue('en')
			.setEmoji(EMOJIS.FLAG_EN)
			.setDefault(actualLang === LANG.EN),
		new StringSelectMenuOptionBuilder()
			.setLabel('Français')
			.setValue('fr')
			.setEmoji(EMOJIS.FLAG_FR)
			.setDefault(actualLang === LANG.FR),
	]

	const menu = new StringSelectMenuBuilder()
		.setCustomId('rules_select-language')
		.addOptions(options)

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
		.addActionRowComponents(wrapInRow(menu))

	return container
}

export async function execute(interaction) {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral })
	
	const lang = getLangFromInteraction(interaction)

	const container = await this.generateRules(LANG.EN)

	interaction.channel.send({
		flags: MessageFlags.IsComponentsV2,
		components: [container]
	})

	interaction.editReply(t(lang, 'commands.ticket_show.sent'))
}