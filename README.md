# What is SpaceBot - The Slack Bot for Space
[![David](https://img.shields.io/david/mikelax/spacebot.svg?maxAge=2592000)](https://david-dm.org/mikelax/spacebot)
[![license](https://img.shields.io/badge/license-Apache--2-blue.svg?maxAge=2592000)](http://www.apache.org/licenses/LICENSE-2.0)

Spacebot is a Slack bot that you can interact with to view images and information about space.
It makes use of information from NASA including their ever popular [Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html) and [mars rovers](http://mars.nasa.gov/) data.

spacebot adds a new `/spacebot` slash command to your slack channels to allow you to easily see new and interesting images about space, astronomy, mars, and more. See the usage section below for details on the lists of available commands. 

NASA currently has two rovers that are exploring the surface of Mars, _Curiosity_ and _Opportunity_. Opportunity was launched in 2003, while Curiosity was launched in 2011. _Spirit_ was also launched as the second rover of the pair in 2003 but became disabled and ultimately decommissioned in 2011. 

Please contact me or open an issue if there is a command or data you would like to see added.

# Install

Click the button below to add spacebot to your slack channel and get started.

<a href="https://slack.com/oauth/authorize?scope=commands&client_id=8804364867.74269805537"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

# Usage

Please [see the instructions page](http://slashspacebot.com/) that list all the commands available.

**Sample command** - Run the following command to see images from the Opportunity rover atop the [highest peak it has climbed](http://mars.nasa.gov/multimedia/images/?ImageID=7789) to date:  `/spacebot rovers photos opportunity navcam 4332`

# Technology Overview

Spacebot is set up and run with a [serverless tech stack](http://thenewstack.io/tag/serverless-computing/).
This project is built upon AWS Lambda using the aptly named [serverless](https://github.com/serverless/serverless) framework for function management.

# License

[Apache License 2.0](LICENSE)
