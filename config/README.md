# Configuration Variables

Secret and environment specific variables are currenlty loaded into the Lambda functions via environment variables. They are loaded into [serverless via yaml config files](https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-in-other-files).

## TODO

An enhancement to be done is to move these environment variables into a secure and easier to manage store. [SSM Parameter Store](https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-using-the-ssm-parameter-store) is a leading option.
