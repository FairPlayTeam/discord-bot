import {
	SlashCommandBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	ContainerBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	MessageFlags,
} from 'discord.js'

import {
	t,
	getLangFromInteraction
} from '../i18n/index.js'

import {
	formatText,
	wrapInRow,
} from '../utils/ui.js'

import {
	LINKS,
	EMOJIS,
	LANG,
} from '../constants.js'

export const data = new SlashCommandBuilder()
	.setName('credits')
	.setDescription('Bot\'s credits')

export const generateCredits = actualLang => {
	const texts = JSON.parse(t(actualLang, 'commands.credits.texts'))

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
		.setCustomId('credits_select-language')
		.addOptions(options)

	const contributeButton = new ButtonBuilder()
		.setStyle(ButtonStyle.Link)
		.setLabel(t(actualLang, 'commands.credits.button_label'))
		.setURL(LINKS.GITHUB_DISCORD_BOT)

	const container = new ContainerBuilder()
		.addTextDisplayComponents(formatText(texts[0]))
		.addSeparatorComponents(separators[0])
		.addTextDisplayComponents(formatText(texts[1]))
		.addActionRowComponents(wrapInRow(contributeButton))
		.addSeparatorComponents(separators[1])
		.addActionRowComponents(wrapInRow(menu))
	
	return container
}

export async function execute(interaction) {
	await interaction.deferReply()
	
	const lang = getLangFromInteraction(interaction)

	const container = await this.generateCredits(LANG.EN)

	interaction.editReply({
		flags: MessageFlags.IsComponentsV2,
		components: [container]
	})
}