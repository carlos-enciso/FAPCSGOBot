const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
import { FAP_CS_BOT } from '../constants';
import DiscordRequestManager from '../utils/discordRequestManager';
const port = 53134;

http.createServer((req, res) => {
	// TODO: Better web page
	let responseCode = 404;
	let content = '404 Error';

	const reqUrl = req.url;

	if (reqUrl.indexOf('code=') > 0) {
		const code = reqUrl.substring(reqUrl.indexOf('code=') + 5);

		let postData = querystring.stringify({
			'client_id': FAP_CS_BOT.CLIENT_ID,
			'client_secret': FAP_CS_BOT.CLIENT_SECRET,
			'grant_type': 'authorization_code',
			'code': code,
			'redirect_uri': 'http://localhost:' + port,
			'scope': 'connections'
		});
		let headers = {
			'Content-Length': postData.length
		};
		DiscordRequestManager.httpCallDiscord('POST', '/oauth2/token', postData, headers).then((_data) => {
			// TODO: Save access_token and refresh_token for future calls
			headers = {
				auth: {
					type: "Bearer",
					creds: _data.access_token
				},
				contentType: "application/json"
			};
			DiscordRequestManager.httpCallDiscord('GET', '/users/@me/connections', null, headers).then((_response) => {
				// TODO: Save from type: 'steam' -> name to compare with CS:GO server
				console.log(_response);
			}).catch(console.log);
		}).catch(console.log);

	}

	responseCode = 200;
	content = fs.readFileSync('./oauth/index.html');

	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});

	res.write(content);
	res.end();
}).listen(port);