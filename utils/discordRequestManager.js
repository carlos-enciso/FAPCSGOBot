const https = require('https');

const REQUEST_TIMEOUT = 15000;
const DISCORD_ENPOINT = 'discordapp.com';
const COMMON_PATH = '/api/v6';

const DiscordRequestManager = (function () {
	const httpCallDiscord = (_method, _path, _body, _options) => {
		return new Promise((resolve, reject) => {
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded'
			};
			let data;
			try {
				if (_options.auth) {
					headers.Authorization = `${_options.auth.type} ${_options.auth.creds}`;
				}
				if (_options['Content-Length']) {
					headers['Content-Length'] = _options['Content-Length'];
				}
				if (headers["Content-Type"] === "application/json") {
					data = JSON.stringify(_body);
				} else {
					data = _body;
				}
			} catch (err) {
				reject(err);
				return;
			}
			const options = {
				hostname: DISCORD_ENPOINT,
				port: 443,
				path: COMMON_PATH + _path,
				method: _method,
				headers: headers
			};

			const request = https.request(options, (_response) => {
				let data = [];
				// A chunk of data has been recieved.
				_response.on('data', (_chunk) => {
					data.push(_chunk);
				});
				// The whole response has been received. Print out the result.
				_response.on('end', () => {
					const response = JSON.parse(Buffer.concat(data).toString());
					resolve(response);
				});

			});
			let reqError;
			request.on("abort", () => {
				reqError = reqError || new Error(`Request aborted by client on ${_method} ${_path}`);
				reject(reqError);
			}).on("aborted", () => {
				reqError = reqError || new Error(`Request aborted by server on ${_method} ${_path}`);
				reject(reqError);
			}).on("error", (err) => {
				reqError = err;
				request.abort();
			});
			request.setTimeout(REQUEST_TIMEOUT, function () {
				reqError = new Error(`Request timed out (>${REQUEST_TIMEOUT}ms) on ${_method} ${_path}`);
				request.abort();
			});
			if (data) {
				request.write(data);
			} else {
				request.end();
			}
		});
	};
	return {
		httpCallDiscord
	};
})();

module.exports = DiscordRequestManager;