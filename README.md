[![Buy Me a Coffee](https://az743702.vo.msecnd.net/cdn/kofi3.png?v=0)](https://ko-fi.com/loki123)

# Foundry to Discord

A lightweight FoundryVTT module that sends all FoundryVTT messages to a Discord webhook. It has the capability to edit AND delete messages in real-time, making it great for play-by-post-style campaigns, logging, and more!

**System Support:**
- Pathfinder Second Edition
- DnD 5e (partial)

While it will work with other systems, the extent of compatibility may vary. Regular chat, chat cards, and rolls seem to work just fine on most other systems.

### What it Supports

**Anonymous:**
- Mimics the behavior of "anonymous" actors, including using replacement names for descriptions and message aliases.
- To avoid Discord grouping up same-named messages, it sends the token ID to Discord with the replacement name (e.g., "Unknown NPC (V73Oqm1EL1KOoXOl)").

**Polyglot:**
- Detects the languages known by players and sends languages they don't know to Discord as "Unintelligible."
- Adds options for the GM to specify which languages the module will "understand" and sends the rest to Discord as "Unintelligible."
- Allows overriding "common" languages in your world to ensure they pass the Polyglot check and are sent to Discord as plaintext.

**Chat Media / Chat GIFs / Similar:**
- Sends image, video links, and uploaded images to Discord.

**Monk's Token Bar:**
- Supports Contested Rolls, Roll Requests, and Experience cards.

**Pf2e Target Damage:**
- Multiple targets are also sent to Discord.

**Midi QOL:**
- Edits Mergecards in real-time.

## Setup

1. Create a Webhook in your Discord server and specify the channel to output chat to. Copy the Webhook URL; you'll need it later.
    - Server Settings (or channel settings) > Integrations > Webhooks > [New Webhook]
    - Set the webhook name and channel to post to.
    - [Copy Webhook URL]
   
   *NOTE:* If you plan on having different Foundry Worlds post to separate Discord OR a separate channel for Rolls, you'll need additional Webhooks.

2. Add the module to FoundryVTT.
    - Add-on Modules > Install Module > Search for Foundry to Discord

3. Open Foundry and enable the module.
    - Game Settings > Manage Modules

4. Configure the module settings in Foundry.
    - Game Settings > Configure Settings > Foundry to Discord
    - For the Invite URL, make sure your address is public. Use a tunneling software if you can't forward ports.

### NOTE: This module will ONLY work if a GM account is logged into the world!

Follow the hints provided by the settings, and use the webhook link from your channel as the Webhook URL. Also, ensure your invite URL is public, which means you'll need to be port-forwarded as usual. If you can't forward ports due to limitations, you can use a network tunnel to expose your port to the internet. [Tailscale](https://www.reddit.com/r/FoundryVTT/comments/15lt40x/easy_public_foundry_vtt_hosting_using_tailscale) is recommended for this purpose.

---

### Full Features:

#### Chat Mirroring

Publicly-seen messages are sent to Discord while attempting to block as much metagame data as possible, depending on your other modules that may change how ChatMessages display information. This works well with the "anonymous" module.

Screenshots are from a Pathfinder Second Edition game. Compatibility with other systems may vary, but regular rolls, regular chat cards, and chat will work fine on ANY system.

Do note that this follows message deletions as well. If a message is deleted in Foundry, it will also be deleted in the channel. Although this can be disabled in the config, it is recommended to keep it on for any "oopsie" moments.

![Chat Mirroring Example](https://github.com/therealguy90/foundrytodiscord/assets/100253440/b7eb9ebd-e64d-4f1e-9ffc-5fd85f025a99)
![Chat Mirroring Example](https://github.com/therealguy90/foundrytodiscord/assets/100253440/caaa5350-fdf2-4aeb-a697-41f59551b506)

#### Threaded Scenes

Discord threads are supported by Foundry to Discord by adding a `?thread_id` query parameter to your webhook URL, but one application of threads is the **Threaded Scenes** feature. Select a Scene in your world, and paste your Thread ID into the boxes. When this feature is used, all message traffic that is found in one scene is automatically sent to the corresponding thread.

![Threaded Scenes Example](https://github.com/therealguy90/foundrytodiscord/assets/100253440/c11578ba-5e52-4baf-b4ce-e6476cebcc20)

#### Server Status Message

Allow your players to check if your world is online by setting your server status as ONLINE in your Server Status Message when a GM logs in. To indicate it's offline, have a GM type "ftd serveroff" in your world chat. Enable this feature in the config with a step-by-step tutorial. Note that this feature is only available for your main Webhook URL. Modules work client-side, so there's not much other better solutions to the problem other than the GM manually using the command to set it offline.

![Server Status Message Example](https://github.com/therealguy90/foundrytodiscord/assets/100253440/8a7c5d08-870f-4155-9153-a822f82d0d6c)

#### The Foundry to Discord API

Foundry to Discord also lets you use its features externally with the API. You can use a macro to send to, edit, and delete messages from your Discord channel. A bit of JavaScript knowledge is required to use it.

**Usage**

Declaration:
```javascript
const ftd = game.modules.get('foundrytodiscord').api
```

Available methods:
#### IMPORTANT NOTE! These methods do not abide with Discord's rate limiting system, so don't spam the requests too much or YOU will be banned from using the API for about an hour!
#### When using these methods in another module, make sure to use the response headers that the methods return to know when you've hit the rate limit! 

### Refer to the [Discord Webhook documentation](https://discord.com/developers/docs/resources/webhook).

```javascript
/* generateSendFormData allows anyone to formulate a simple message that can be sent to the webhook without much knowledge of javascript or the Discord API.
*  Parameters:
*  (string) content (required): A string of characters to be sent as a message. If you only want to send an embed, leave this as "".
*  (Array) embeds (optional, default=[]): Up to 10 embeds can be included here. Refer to https://discord.com/developers/docs/resources/webhook for instructions on how to construct an embed.
*  (string) username (optional, default=game.user.name): A custom username for your message. The default is your client username.
*  (string) avatar_url (optional, default is the FoundryVTT icon): A link to a JPG, PNG, or WEBP that can be accessed publicly. This will be used as the avatar of the webhook for that message.
*  Output: a FormData object containing parameters that are compatible with the Discord webhook, and can be used in junction with Foundry to Discord's API sendMessage() method.
*/
let myMessageContents = ftd.generateSendFormData("Hello, World!");
```

```javascript
/* (async) sendMessage sends a message to the webhook.
*  Parameters:
*  (FormData) formData (required): A FormData object containing the specifics of the message being sent.
*  (boolean) isRoll (optional, default=false): Determines whether the message being sent is ending up in the Webhook URL, or the Roll Webhook URL.
*  (string) sceneID (optional, default=""): If your world is using the Threaded Scenes feature, inputting a scene ID here will let the module know where to send it.
*  Output: Returns an Object with the API response and the Discord Message object in the format of { response, message }. These can later be used to edit or delete the message that was sent using editMessage() and deleteMessage() respectively.
*/
const responseAndMessage = await ftd.sendMessage(myMessageContents);
```

```javascript
/* (async) editMessage edits a message in the channel or thread.
*  Parameters:
*  (FormData) formData (required): A FormData object containing the specifics of the message that will replace the contents of the specified message in discord.
*  (string) webhook (required): The URL that was used to send the message. If you used sendMessage(), you can use the url in the response that it returns.
*  (string) messageID (required): The Discord message ID of the message that will be edited.
*  Output: This sort of request usually ends in a 204 code, which means no response body will be in the response, but editMessage() will return a response anyways for headers.
*/
await ftd.editMessage(newMessageFormData, responseAndMessage.response.url, responseAndMessage.message.id);
```

```javascript
/* (async) deleteMessage deletes a message in the channel or thread.
*  Parameters:
*  (string) webhook (required): The URL that was used to send the message. If you used sendMessage(), you can use the url that it returns.
*  (string) messageID (required): The Discord message ID of the message that will be edited.
*  Output: This sort of request usually ends in a 204 code, which means no response body will be in the response, but deleteMessage() will return a response anyways for headers.
*/
await ftd.deleteMessage(responseAndMessage.response.url, responseAndMessage.message.id);
```

--------------------------------------------------

I have to thank caoranach for making DiscordConnect, as I did use some code from there to create Foundry to Discord, especially mimicking the options scheme of DiscordConnect, and of course, the same instructions to set it up.

If anyone wants to help with this project, you can talk with me on Discord @loki123. I'm always looking for help. If you want to port this over to a system you want, go ahead and open a PR! I'll help as much as I can.
