echo -e "\e[47;30;1mBOT IS UPDATING AND RESTARTING\e[0m"
echo -e "\e[47;30;1mDELETING ALL OF THE FILES\e[0m"
rm -rf *
echo -e "\e[47;30;1mCLONING FROM THE OFFICIAL GITHUB REPOSITORY\e[0m"
git clone https://github.com/FairPlayTeam/discord-bot.
echo -e "\e[47;30;1mINSTALLING THE DEPENDENCIES\e[0m"
bun i
echo -e "\e[47;30;1mSTARTING THE BOT\e[0m"
mv discord-bot/* .
rm -rf discord-bot
bun start