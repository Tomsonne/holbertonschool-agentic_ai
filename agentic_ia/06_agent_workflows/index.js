const fs = require('fs').promises;
const path = require('path');

const tasksFile = path.join(__dirname, 'tasks.json');
const cycleDelay = 5000;

async function runCycle() {
  const content = await fs.readFile(tasksFile, 'utf8');
  const tasks = JSON.parse(content);
  const pendingTask = tasks.find((task) => task.status === 'pending');

  if (pendingTask) {
    console.log(pendingTask.action);
  }
}

async function monitorTasks() {
  while (true) {
    await runCycle();
    await new Promise((resolve) => setTimeout(resolve, cycleDelay));
  }
}

monitorTasks();
