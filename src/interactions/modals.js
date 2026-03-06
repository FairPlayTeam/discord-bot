import { MessageFlags } from 'discord.js'

import {
	IDS,
	ROLES,
} from '../constants.js'

import {
	extractLang,
	findMenuSelectionFromInteraction,
	verifyARole,
} from '../utils/ui.js'

import {
	t,
	getLangFromInteraction,
} from '../i18n/index.js'

import { createCandidateTicket } from '../tickets/types/candidate.js'
import { handleCreateCategoryModal } from '../tickets/interactions/config.js'

export async function handleModal(interaction, context) {
	const { store } = context || {}
	if (interaction.customId.startsWith(IDS.tickets.modalGetUserInfosCandidate)) {
		const formData = {
			age: interaction.fields.getTextInputValue('age'),
			position: interaction.fields.getTextInputValue('position'),
			detail: interaction.fields.getTextInputValue('detail'),
			qualities: interaction.fields.getTextInputValue('qualities'),
			remunerated: findMenuSelectionFromInteraction(interaction.fields.getStringSelectValues('remunerated')),
		}
		
		const lang = extractLang(interaction.customId)
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const config = store?.getTicketConfig(interaction.guild.id,lang)
		const channel = await createCandidateTicket(interaction, lang, formData, config)
		await interaction.editReply({ content: `👀 <#${channel.id}>` })
		return true
	}

	if (interaction.customId.startsWith(IDS.tickets.modalCreateCategory)) {
		return await handleCreateCategoryModal(interaction)
	}

	if (interaction.customId === 'rules_accept') {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const lang = getLangFromInteraction(interaction)

		if (verifyARole(interaction.member, ROLES.RULES_ACCEPTED)) {
			await interaction.editReply(t(lang, 'rules.already_accepted'))
		} else {
			await interaction.member.roles.add(ROLES.RULES_ACCEPTED)

			await interaction.editReply(t(lang, 'rules.accepted', { roleId: ROLES.RULES_ACCEPTED }))
		}
	}

	return false
}