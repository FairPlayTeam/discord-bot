import { generateRules } from "../commands/rules_show_container.js"
import { generateCredits } from "../commands/credits.js"
import { findMenuSelectionFromInteraction } from "../utils/ui.js"
import { MessageFlags } from "discord.js"

export async function handleMenus (interaction) {
	const menu = findMenuSelectionFromInteraction(interaction)

	switch (interaction.customId) {
		case "rules_select-language":
			await interaction.deferUpdate()
			await interaction.editReply({
				flags: MessageFlags.IsComponentsV2,
				components: [generateRules(menu)]
			})

			return;
		case "credits_select-language":
			await interaction.deferUpdate()
			await interaction.editReply({
				flags: MessageFlags.IsComponentsV2,
				components: [generateCredits(menu)]
			})

			break;

	}
}