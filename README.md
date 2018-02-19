# TommyFoodie Bot

TommyFoodie is a bot that will help your team member to form groups and have lunch out.

## Getting Started

First of all, add a .env file with the following structure:

```console
SLACK_CLIENT_SECRET=*****
SLACK_CLIENT_ID=*****
SLACK_BOT_USER_OAUTH_ACCESS_TOKEN=*****
SLACK_VERIFICATION_TOKEN=*****
```
Then, you can customize TommyFoodie from config folder.

#### Configuration file

+ mode: **automatic** or **manual**.
  + automatic: TommyFoodie will start and finish grouping at the given time.
  + manual: TommyFoodie will start and finish grouping when someone write start and finish phrases.
+ startSchedule: string to define start time schedule with automatic mode. More info [here](https://github.com/merencia/node-cron/blob/master/README.md).
+ endSchedule: string to define finish time schedule with automatic mode
+ groupSize: integer that defines max size of groups.
+ phrases
  + startAuto: string phrase after which TommyFoodie will save the channel where it will start grouping at the defined time.
  + start: string phrase after which TommyFoodie will start adding participants in manual mode.
  + finish: string phrase after which TommyFoodie will finish adding and start grouping in manual mode.
  + greeting: string that TommyFoodie will send to the channel to announce that it has started.

## Development

#### Setup

Follow the steps given in the official [slackapi](https://github.com/slackapi) events API adapter for Node that can be found [here](https://github.com/slackapi/node-slack-events-api).

#### Run Test

```console
$  npm run test
```
