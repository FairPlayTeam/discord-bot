import { generateCredits } from "../commands/credits.js"
import { findMenuSelectionFromInteraction } from "../utils/ui.js"
import { t } from '../i18n/index.js'
import { LANG } from '../constants.js'

import {
	MessageFlags,
	ModalBuilder,
	TextDisplayBuilder,
} from "discord.js"

export async function handleMenus (interaction) {
	const menu = findMenuSelectionFromInteraction(interaction)

	switch (interaction.customId) {
		case "credits_select-language": {
			await interaction.reply({
				flags: MessageFlags.IsComponentsV2,
				components: [generateCredits(menu)]
			})

			break;
		}
	}
}