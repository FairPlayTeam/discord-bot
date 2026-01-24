import { generateRules } from "../commands/rules_show_container"
import { findMenuSelectionFromInteraction } from "../utils/ui.js"
import { MessageFlags } from "discord.js"

export async function handleMenus (interaction) {
    switch (interaction.customId) {
        case "rules_select-language":
            await interaction.deferUpdate()
            const rulesContainer = await generateRules(findMenuSelectionFromInteraction(interaction))
            await interaction.editReply({
                flags: MessageFlags.IsComponentsV2,
                components: [rulesContainer]
            })

            break
    }
}