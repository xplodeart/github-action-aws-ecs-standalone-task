# github-action-aws-ecs-standalone-task

[![NPM Version](https://img.shields.io/npm/v/aws-ecs-standalone-task)](https://www.npmjs.com/package/aws-ecs-standalone-task)

Start an ECS Standalone task, wait for it to complete and get it's logs from CloudWatch.

This package mimics the `aws ecs run-task` aws-cli command and awaits it's execution.

Made for personal use, but if it suites your needs you are welcome to use it.

[NPM Package](https://www.npmjs.com/package/aws-ecs-standalone-task) available for use within your code.

## Requirements

You need to have an ECS Cluster as well as a task definition created for your task along with container definitions and optionally a log group where it's container writes the log events.

## Usage

### Github Actions

To use the GitHub Action, you'll need to add it as a step in your workflow file.

```yaml
on:
  push:
    branches: main

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run an AWS ECS Standalone Task
        uses: xplodeart/github-action-aws-ecs-standalone-task@v1
        with:
          aws_region: "us-east-2"
          # ecs:RunTask and ecs:DescribeTasks permissions to the IAM User
          # optional: logs:GetLogEvents permission for the log-group and log-stream
          aws_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          ecs_cluster: "MyClusterName"
          ecs_task_def: "my-standalone-task-definition"
          security_groups: "sg-*****************,sg-*****************"
          subnets: "subnet-*****************"
          #check_interval: "6000" #default 6000 to check for each 6 seconds
          #iterations: "20" #default 20 to check for completion 20 times each interval
          #optional
          #log_read_enable: false
          #log_group_name: "/ecs/my-standalone-ecs-task"
          #log_stream_prefix: "ecs/my-task-container/"
```

## License

MIT
