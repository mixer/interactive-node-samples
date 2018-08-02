const mixer = require('@mixer/interactive-node');
const auth = require('mixer-shortcode-oauth');

// Place your app info in mixerauth.json, schema is:
// {
//     "clientId": "",
//     "clientSecret": null, /* optional if you don't have a cient secret */
//     "versionId": 0
// }
const authfile = './mixerauth.json';

// Update this scene array if needed
const scenesArray = [
    {
        sceneID: 'default',
        controls: [],
        containers: [],
    },
];

class MinimalMixerGameClient {
    constructor(authToken) {
        this.client = new mixer.GameClient();

        this.client.on('open', () => this.mixerClientOpened());
        this.client.on('error', e => this.mixerGameClientError(e));

        this.client.open(authToken).catch(this.mixerGameClientError);
    }

    mixerClientOpened() {
        console.log('Mixer client opened');
        this.client.on('message', (err) => console.log('<<<', err));
        this.client.on('send', (err) => console.log('>>>', err));

        this.client
            .getScenes()
            .then(() => this.createScenes())
            .then(() => this.goLive())
            .catch(this.mixerGameClientError);
    }

    createScenes() {
        return this.client.updateScenes({ scenes: scenesArray });
    }

    goLive() {
        console.log('going live');
        this.client
            .ready()
            .then(() => console.log('client ready'))
            .catch(e => {
                console.error('interactive client error readying: ', e);
                throw e;
            });
    }

    mixerGameClientError(error) {
        console.error('interactive error: ', error);
    }
}

// Authenticate with Mixer using oauth
// Will print a shortcode out to the terminal
mixer.setWebSocket(require('ws'));
const authToken = require(authfile);
if (typeof authToken.clientId !== 'string') {
    throw new Error('clientId was not a string');
}

if (typeof authToken.clientSecret !== 'string' && authToken.clientSecret !== null) {
    throw new Error('clientSecret was not a string or null');
}

if (typeof authToken.versionId !== 'number') {
    throw new Error('versionId was not a number');
}

const authInfo = {
    client_id: authToken.clientId,
    client_secret: authToken.clientSecret,
    scopes: [
        'interactive:manage:self',
        'interactive:play',
        'interactive:robot:self',
    ],
};

const store = new auth.LocalTokenStore(__dirname + '/mixertoken.json');
const authClient = new auth.ShortcodeAuthClient(authInfo, store);
authClient.on('code', code => {
    console.log(`Go to https://mixer.com/go?code=${code} and enter code ${code}...`);
});

authClient.on('authorized', (token) => {
    console.log('Got token!', token);
    const _instance = new MinimalMixerGameClient({
        authToken: token.access_token,
        versionId: authToken.versionId,
    });
});

authClient.on('expired', () => {
    console.error('Auth request expired');
    process.exit(1);
});

authClient.on('declined', () => {
    console.error('Auth request declined');
    process.exit(1);
});

authClient.on('error', (e) => {
    console.error('Auth error:', e);
    process.exit(1);
});

authClient.doAuth();
