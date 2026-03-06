import {
	CHANNELS,
} from '../constants.js'

export function onMessageCreate(store) {
	return async function (message) {
		if ((store.data[message.guild.id] || {})[message.author.id]?.vanished) {
			await message.delete()
			const webhooks = await message.channel.fetchWebhooks()
			let webhook = webhooks.find(
				w => w.id === store.getWebhookId(message.guild.id, message.author.id)
			)
			const names = [
				'ù*$@&$^%µ',
				'ù$@#Øµ^ù$',
				'*ế$ù$^ù$@#Øµ^ù$',
				'ế$ù$^ù$@#Øµ^ù$*',
				'ế$ù$^ù$@#Øµ^ù$*ế',
				'ế$ù$^ù$@#Øµ^ù$*ế$',
			]
			if (!webhook) {
				webhook = await message.channel.createWebhook({
					name: names[Math.floor(Math.random() * names.length)],
					avatar: 'https://wallpapercave.com/wp/wp5709615.jpg', //holy skid
				})
				store.setWebhookId(message.guild.id, message.author.id, webhook.id)
			}
			await webhook.send({ content: message.content })

			if(store.isTicketChannel(message.guild.id, message.channel)){
				await store.logMessageChannel(message.guild.id, message)
			}

			return true
		}
		if(store.isTicketChannel(message.guild.id, message.channel)){
			await store.logMessageChannel(message.guild.id, message)
		}

		const dico = store.getAutoReply(message.guild.id);
		const searchList =  Object.keys(dico);
		const text = message.content.toLowerCase()
		const regex = new RegExp(`\\b(${searchList.join("|")})\\b`, "gi");
		const isWordIn = regex.test(text);
		if (isWordIn && !message.author.bot){
			const words = text.match(regex);
			for (const word of words){
				if(word){
					await message.channel.send({content : dico[word]})
				}
			}
		}

		if (message.channel.id === CHANNELS.INFINITE_ROAD) {
			const regex = /^(\d+((\.|,)\d+)? *( *(\+|\-|\*|\/|(\*\*)) *\d+((\.|,)\d+)?)*) *([\s\S]*)$/
			if (regex.test(message.content) && (message.author.id !== process.env.CLIENT_ID)) {
				let expr = message.content.match(regex)[1]
				expr = expr.replaceAll(",", ".")
				const numberStr = eval(expr) + ""

				const cleanedExpr = expr.replace(/ *(\+|\-|\*|\/|(\*\*)) *(\d+)/g, " $1 $3")
										.trim()

				let text = message.content.match(regex)[9]
				if (text.match(/<@(\d+)>/g)) {
					const match = text.match(/<@(\d+)>/g)
					for (const ping of match) {
						const userID = ping.match(/<@(\d+)>/)[1]
						let nameOfUser = 'Unknown user'

						try {
							const guild = await message.guild.fetch()
							const member = (await guild.members.fetch(userID)).user
							nameOfUser = member.globalName || member.username
						} catch (err) {
							console.error(err.stack)
						}

						text = text.replace(`<@${userID}>`, `\`@${nameOfUser}\``)
					}
				}

				let mcontent = `\`${cleanedExpr} = ${numberStr}\` ${text}`

				if (cleanedExpr === numberStr) {
					mcontent = `\`${numberStr}\` ${text}`
				}

				console.log(mcontent)

				const webhooks = await message.channel.fetchWebhooks()

				const name = 'Infinite Road Webhook'

				let webhook = webhooks.find(
					w => w.name === name
				)

				if (!webhook) {
					webhook = await message.channel.createWebhook({ name })
				}

				await message.delete()

				if (!(store.getInfiniteRoadLastUserId(message.guild.id) !== message.author.id)) return true
				if (!(store.getInfiniteRoadCount(message.guild.id) + 1 === Number(numberStr))) return true

				await webhook.send({
					username: message.author.globalName || message.author.username,
					avatarURL: message.author.displayAvatarURL({
						size: 4096,
						extenstion: 'gif',
						forceStatic: false
					}),
					content: mcontent
				})

				store.setInfiniteRoadLastUserId(message.guild.id, message.author.id)
				store.increaseInfiniteRoad(message.guild.id)
			} else {
				if (!message.author.bot) {
					message.delete()
				}
			}
			return true
		}
	}
}
