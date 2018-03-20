# Mixer Minimal Game client
A minimal game client that connects to interactive and sends a scenes json array. Also does shortcode auth.

If you're looking for a version that runs in your browser, see [mixer-minimal-game-client-web](../mixer-minimal-game-client-web).

## Getting Started
First, configure the game client to connect to your interactive game by editing `mixerauth.json`:
 - `clientId` is an oauth application ID you've created in the [Mixer Developer Lab](https://mixer.com/lab/oauth)
 - `clientSecret` also comes from your oauth application, if you're using the secret. Otherwise, leave it `null`.
 - `versionId` is your interactive game project version id. From the [interactive projects page](https://mixer.com/lab/interactive) select your project, open the `Code` tab, and copy the numeric code.

Once you've edited `mixerauth.json`, start the game client by running the following in a command prompt (you need [NodeJS](https://nodejs.org/en/download/) if you don't already have it):
```bash
cd interactive-node-samples/mixer-minimal-game-client
npm i
npm run start
```

You'll receive a prompt in your command line to enter a shortcode on Mixer. Do that and the client should start.

## Custom Scene Data
If you need controls or scenes to be configured when your project runs you can edit the `scenesArray` variable in `minimal_game_client.js`:
```javascript
const scenesArray = [
    {
        sceneID: "default",

        /* Define controls */
        controls: [],

        /* Define containers (optional, remove if not used) */
        containers: []
    }
];
```
