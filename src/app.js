'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const axios = require('axios');

const ENDPOINT = 'http://localhost/v1';
const app = new App();

app.use(new Alexa(), new GoogleAssistant(), new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	async MeetingsIntent() {
		try {
			const response = await axios.get(ENDPOINT + '/sidebar?type=meeting');
			console.log('success');
			this.ask('Done');
		} catch (error) {
			console.error('error');
			this.ask('Something went wrong');
		}
	},

	async MeetingIntent() {
		try {
			const response = await axios.get(ENDPOINT + '/sidebar?type=meeting&value=' + this.$inputs.meetingName.value);
			console.log('success');
			this.ask('Done');
		} catch (error) {
			console.error('error');
			this.ask('Something went wrong');
		}
	},

	async KeywordsIntent() {
		try {
			const response = await axios.get(ENDPOINT + '/sidebar?type=keyword');
			console.log('success');
			this.ask('Done');
		} catch (error) {
			console.error('error');
			this.ask('Something went wrong');
		}
	},

	async KeywordIntent() {
		try {
			const response = await axios.get(ENDPOINT + `/sidebar?type=keyword&value=${this.$inputs.keyword.value}`);
			console.log('success');
			this.ask('Done');
		} catch (error) {
			console.error('error');
			this.ask('Something went wrong');
		}
	},

	HelloWorldIntent() {
		this.$speech.addText('Welcome to Knocap Reminder.');
		this.$speech.addText(
			'With this skill I can help you to search voice notes colleagues of you have saved before.'
		);
		this.$speech.addText('Do you already know how Knocap Reminder works?');
		this.followUpState('HelloWordState').ask(this.$speech);
	},

	HelloWordState: {
		YesIntent() {
			this.$speech.addText("Great! I'll be around, let me know when you need my help.");
			this.$speech.addText("Also, if you forget how this skill works say 'Alexa, remind me instructions'.");
			this.followUpState(null).ask(this.$speech);
		},
		NoIntent() {
			this.followUpState(null).toIntent('RemindIntent');
		},
		Unhandled() {
			this.ask('Please answer Yes or No.');
		}
	},

	RemindIntent() {
		// this.$speech.addText("With KNOCAP-reminder you can search notes for a certain keyword, or you can search notes for a specific meeting.")
		this.$speech.addText(
			'With KNOCAP-reminder you can search notes for a certain keyword, or you can search notes for all meetings.'
		);

		this.$speech.addText(
			"To search notes using a keyword say 'Alexa, search notes for TCP' or you can also say, what did we say about TCP?."
		);

		// this.$speech.addText("To search notes for a meeting, you can say 'Alexa, show me the notes for Pilot 7'.");
		this.$speech.addText("To find out all keywords recorded, say 'Alexa, show me all keywords'.");
		this.$speech.addText("To find out all meetings, say 'Alexa, show me all meetings'.");

		// NotImplementedYet
		// this.$speech.addText("You could also say 'Alexa, pull the notes from last meeting' to bring the notes from your last meeting.");
		this.ask(this.$speech);
	},

	Unhandled() {
		this.ask('I am not sure! Please try again!');
	},

	END() {
		this.tell('Bye!');
	}
});

module.exports.app = app;
