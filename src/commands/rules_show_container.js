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
import { t, getLangFromInteraction } from '../i18n/index.js'
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

/*export async function execute(interaction) {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral })
	
	const lang = getLangFromInteraction(interaction)

	const texts = [
		"## 🔸 Server's rules",
		"### 1. Respect and Courtesy\n1.1 Be respectful to all members. Any form of harassment, discrimination, or hate speech will not be tolerated.\n1.2 Conflicts must be handled in a mature manner. If necessary, contact a moderator or the administration team for mediation.",
		"### 2. Appropriate Content\n2.1 Keep discussions suitable for a diverse audience. Avoid sensitive topics such as politics, religion, and adult content.\n2.2 No spam (includes testing the automatic reply message from <@1428353737180708945>), unsolicited advertising, or sharing of malicious links.",
		"### 3. Language and Behavior\n3.1 Use appropriate language. Avoid insults, offensive, or vulgar language.\n3.2 Respect the different channels and their topics. Do not divert a channel from its original purpose.",
		"### 4. Moderation\n4.1 Moderators are here to ensure the smooth functioning of the server. In case of disagreement, please contact us via <#1429484550513491978> or in ⁠<#1410185878495690752> or via a ⁠<#1385601656758210684>. Stay calm and respectful.\n4.2 Failure to comply with the rules may result in sanctions such as warnings, mutes, or bans.",
		"### 5. Privacy and Security\n5.1 Do not share personal information on the server.\n5.2 Be cautious of scams and protect your personal data.\n5.3 If you discover a bug, security vulnerability, or exploit, **do not test or demonstrate it in public, and do not use it**. Immediately report the issue privately to the staff via a <#1385601656758210684> or by DMing an admin. Deliberately exploiting, encouraging others to exploit, sharing proof-of-concepts publicly, or attempting to weaponize a vulnerability is strictly prohibited and may result in sanctions such as a warning, mute, or ban, depending on the severity.",
		"# DO NOT PING FOXTER PLEASE\nWith that said, welcome to the server! 👋"
	]

	const separators = [
		new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small),
		new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
	]

	const options = [
		new StringSelectMenuOptionBuilder()
			.setLabel('English')
			.setValue('english')
			.setEmoji(EMOJIS.FLAG_EN)
			.setDefault(true),
		new StringSelectMenuOptionBuilder()
			.setLabel('Français')
			.setValue('french')
			.setEmoji(EMOJIS.FLAG_FR),
	]

	const menu = new StringSelectMenuBuilder()
		.setCustomId('rules_select-language')
		.addOptions(options)

	const actionRowMenu = new ActionRowBuilder().addComponents(menu)

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
		.addActionRowComponents(actionRowMenu)

	await interaction.channel.send({
		flags: MessageFlags.IsComponentsV2,
		components: [container]
	})

	await interaction.editReply(t(lang, 'commands.tickets_show.sent'))
}*/