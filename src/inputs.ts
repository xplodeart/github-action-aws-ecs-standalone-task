import * as core from "@actions/core";

import type { AwsConfig, EcsResources, CloudLogResources } from "aws-ecs-standalone-task";

interface Inputs {
  awsConfig: AwsConfig;
  ecsResources: EcsResources;
  checkInterval: number;
  iterations: number;
  cloudLogResources?: CloudLogResources;
  readLogs: boolean;
}

function commaSeparatedToArray(str: string): string[] {
  if (str.includes(",")) {
    return str.split(",");
  }

  return [str];
}

function readInputs(): Inputs | null {
  try {
    const inputs: Inputs = {
      awsConfig: {
        region: core.getInput("aws_region"),
        credentials: {
          accessKeyId: core.getInput("aws_key"),
          secretAccessKey: core.getInput("aws_secret", {}),
        },
      },
      ecsResources: {
        cluster: core.getInput("ecs_cluster"),
        taskDefinition: core.getInput("ecs_task_def"),
        securityGroups: commaSeparatedToArray(core.getInput("security_groups")),
        subnets: commaSeparatedToArray(core.getInput("subnets")),
      },
      checkInterval: parseInt(core.getInput("check_interval")),
      iterations: parseInt(core.getInput("iterations")),
      readLogs: false,
    };

    const logsEnabled = core.getBooleanInput("log_read_enable");

    if (logsEnabled) {
      inputs.readLogs = true;

      inputs.cloudLogResources = {
        logGroupName: core.getInput("log_group_name"),
        logStreamPrefix: core.getInput("log_stream_prefix"),
      };
    }

    return inputs;
  } catch (error) {
    core.debug(error.message);
  }

  return null;
}

export default readInputs;
