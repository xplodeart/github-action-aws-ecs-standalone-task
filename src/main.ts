import * as core from "@actions/core";

import { EcsTaskManager, LogReader } from "aws-ecs-standalone-task";

import readInputs from "./inputs";

async function main(): Promise<void> {
  try {
    const inputs = readInputs();

    if (!inputs) {
      throw new Error("Error getting required input data");
    }

    const ecs = new EcsTaskManager(inputs.awsConfig, inputs.ecsResources);

    const taskId = await ecs.dispatchTask();

    if (!taskId) {
      throw new Error("Task is not dispatched");
    }

    core.info("Task id: " + taskId);

    await ecs.waitForTaskComplete(taskId, inputs.checkInterval, inputs.iterations);

    if (inputs.readLogs && inputs.cloudLogResources) {
      const logs = new LogReader(inputs.awsConfig, inputs.cloudLogResources);

      const log = await logs.parse(taskId);

      if (log.hasErrors) {
        throw new Error("Task Failed: " + log.messages.join("\n"));
      }

      core.info("Task Log: " + log.messages.join("\n"));
    }

    core.setOutput("status", "SUCCESS");
  } catch (error) {
    core.setFailed(error.message);
  }
}

export default main;
