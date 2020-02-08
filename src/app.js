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

	async ConnectIntent() {
		try {
			console.log(ENDPOINT + '/sidebar?type=connect&pinCode=' + this.$inputs.pinCode.value);
			const response = await axios.get(ENDPOINT + '/sidebar?type=connect&pinCode=' + this.$inputs.pinCode.value);
			const meetingId = response.data.meetingId;
			if(meetingId === "") {
				this.ask("I cannot connect to the meeting with the provided pin code, please try again!");
			} else {
				this.$session.$data.pinCode = this.$inputs.pinCode.value;
				this.ask("Connected to the meeting!");
			}
		} catch (error) {
			console.error('error:ConnectIntent');
			this.ask('Something went wrong');
		}
	},

	async MeetingsIntent() {
		if(this.$session.$data.pinCode === undefined || this.$session.$data.pinCode === '') {
			this.ask('Please connect to a meeting first!');
			return;
		}
		try {
			const response = await axios.get(ENDPOINT + '/sidebar?type=meeting' + `&pinCode=${this.$session.$data.pinCode}`);
			console.log('success:MeetingsIntent');
			this.ask('Done');
		} catch (error) {
			console.error('error:MeetingsIntent');
			this.ask('Something went wrong');
		}
	},

	async MeetingIntent() {
		if(this.$session.$data.pinCode === undefined || this.$session.$data.pinCode === '') {
			this.ask('Please connect to a meeting first!');
			return;
		}
		try {
			const response = await axios.get(ENDPOINT + '/sidebar?type=meeting&value=' + this.$inputs.meetingName.value + `&pinCode=${this.$session.$data.pinCode}`);
			console.log('success:MeetingIntent');
			this.ask('Done');
		} catch (error) {
			console.error('error:MeetingIntent');
			this.ask('Something went wrong');
		}
	},

	async KeywordsIntent() {
		if(this.$session.$data.pinCode === undefined || this.$session.$data.pinCode === '') {
			this.ask('Please connect to a meeting first!');
			return;
		}
		try {
			const response = await axios.get(ENDPOINT + '/sidebar?type=keyword' + `&pinCode=${this.$session.$data.pinCode}`);
			console.log('success:KeywordsIntent');
			this.ask('Done');
		} catch (error) {
			console.error('error:KeywordsIntent');
			this.ask('Something went wrong');
		}
	},

	async KeywordIntent() {
		if(this.$session.$data.pinCode === undefined || this.$session.$data.pinCode === '') {
			this.ask('Please connect to a meeting first!');
			return;
		}
		try {
			const response = await axios.get(ENDPOINT + `/sidebar?type=keyword&value=${this.$inputs.keyword.value}` + `&pinCode=${this.$session.$data.pinCode}`);
			console.log('success:KeywordIntent');
			this.ask('Done');
		} catch (error) {
			console.error('error:KeywordIntent');
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
		this.$speech.addText(
			'With knocap-reminder you can search notes for a certain keyword, or you can search notes for all meetings.'
		);

		this.$speech.addText(
			"To search notes using a keyword say 'search notes for TCP' or you can also say, what did we say about TCP?."
		);

		this.$speech.addText("To search notes for a meeting, you can say 'show me the notes for meeting whiteboard'.");
		this.$speech.addText("To find out all keywords recorded, say 'show me all keywords'.");
		this.$speech.addText("To find out all meetings, say 'show me all meetings'.");

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
