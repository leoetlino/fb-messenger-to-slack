# fb-messenger-to-slack

Post messages from Facebook Messenger to Slack

## Requirements
- Node.js (at least 0.10)

## Setup

Clone the repo and then install the npm modules
(as well as bunyan, used for logs):

```
cd fb-messenger-to-slack
sudo npm -g install bunyan
npm install
```

Configure the app by creating and editing config/local.yaml.
An example config file is included in config/default.yaml.

Finally, start the app:

```
node bootstrap.js | bunyan -o short -L
```

## Motivation

People resist to change. Really. I know some people who wouldn't give up
their beloved Facebook Messenger even if it meant a group chat of more than 30 people,
with tons of new messages regularly, which means having 300+ unread messages
if you were away for a few days.

Since they didn't want to envisage a better alternative (Slack), I decided to
forward all of the messages to Slack. While it isn't ideal, it at least sends
notifications for trigger words and tracks the last read message state infinitely better.

## Contributing

Pull requests are welcome. When contributing code, make sure to follow
the existing code style and write clear commit messages.

## License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
