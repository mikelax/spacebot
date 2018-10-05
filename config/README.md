# Configuration Variables

Secret and environment specific variables are currenlty loaded into the Lambda functions via environment variables. They are loaded into [serverless via yaml config files](https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-other-files).

## Get Started

Copy the existing `config.sample.yml` file to create a config file for each environment you want to create. Currently `config.dev.yml` and `config.prod.yml`, which are both in the gitignore file. Fill in appropriate values for each configuration.

## TODO

An enhancement to be done is to move these environment variables into a secure and easier to manage store. [SSM Parameter Store](https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-using-the-ssm-parameter-store) is a leading option.
