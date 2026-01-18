import {
    TextDisplayBuilder,
    MediaGalleryItemBuilder,
    MediaGalleryBuilder,
    ContainerBuilder,
    MessageFlags,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
} from 'discord.js'

import {
    EMOJIS,
    CHANNELS,
} from '../constants.js'

import { createChannelLink } from '../utils/ui.js'

import {
	createCanvas,
	loadImage,
	Canvas
} from '@napi-rs/canvas'
import axios from 'axios'
import fs from 'fs'

export function onGuildMemberAdd() {
    return async (member) => {
        const memberCount = member.guild.memberCount

		const user = member.user
		let response

        try {
        	response=await axios.get(user.avatarURL({ dynamic: false, size: 4096 }) || user.defaultAvatarURL, {
            	responseType: 'arraybuffer'
        	})
        } catch (err) {
			console.error(`%s%c`, `𝗘𝗥𝗥𝗢𝗥: Could not fetch <@${user.id}>'s avatar:\n${err.stack}`,'color: red')
		}

		const avatarBuffer = Buffer.from(response.data)
		const backgroundBuffer = fs.readFileSync('./src/images/welcome_fp.png')
		const canvas = createCanvas(680, 240)
		const ctx = canvas.getContext('2d')

		const background = await loadImage(backgroundBuffer)
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

		ctx.font = 'bold 30px fpfont, Arial'
		ctx.textAlign = 'center'
		ctx.fillStyle = '#ffffff'
		ctx.fillText(`Welcome ${user.globalName || user.username}!`, 420, 120)

        ctx.beginPath()
        ctx.arc(114, 114, 66, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

		const avatar = await loadImage(avatarBuffer)
		ctx.drawImage(avatar, 48, 48, 132.5, 132.5)
        ctx.restore()
		

		const buffer=canvas.toBuffer('image/png')
		const attachment=new AttachmentBuilder(buffer, {
			name: `welcome${user.id}.png`
		})

        const text1 = new TextDisplayBuilder().setContent(`### Welcome to FairPlay <@${member.id}>! ${EMOJIS.PEPE_GUYS_BOUNCING}\nGive him a warm welcome in <#${CHANNELS.TEXT_EN}> or in <#${CHANNELS.VOCAL_EN}>!`)
        const text2 = new TextDisplayBuilder().setContent(`You're the member **#${memberCount}**!`)

        const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)

        const buttonViewRules = new ButtonBuilder()
            .setLabel("View the server's rules!")
            .setStyle(ButtonStyle.Link)
            .setURL(createChannelLink(CHANNELS.RULES))

        const buttonChat = new ButtonBuilder()
            .setLabel("Chat with our community!")
            .setStyle(ButtonStyle.Link)
            .setURL(createChannelLink(CHANNELS.WELCOME))

        const actionRow = new ActionRowBuilder().addComponents(buttonViewRules, buttonChat)

        const item = new MediaGalleryItemBuilder()
            .setURL(`attachment://welcome${user.id}.png`)
        const gallery = new MediaGalleryBuilder().addItems(item)

        const container = new ContainerBuilder()
            .addTextDisplayComponents(text1)
            .addSeparatorComponents(separator)
            .addMediaGalleryComponents(gallery)
            .addSeparatorComponents(separator)
            .addTextDisplayComponents(text2)
            .addActionRowComponents(actionRow)

        const channel = await member.guild.channels.cache.get(/*CHANNELS.WELCOME*/'1367910796687839324')
        await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [container],
            files: [attachment]
        })
    }
}