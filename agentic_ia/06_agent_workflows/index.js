const fs = require('fs').promises;
const path = require('path');

const tasksFile = path.join(__dirname, 'tasks.json');
const cycleDelay = 5000;

async function runCycle() {
  const content = await fs.readFile(tasksFile, 'utf8');
  const tasks = JSON.parse(content);

  if (!Array.isArray(tasks)) {
    throw new Error('tasks.json doit contenir un tableau');
  }

  const pendingTask = tasks.find((task) => task.status === 'pending');

  if (pendingTask) {
    console.log(pendingTask.action);
  }
}

async function monitorTasks() {
  while (true) {
    try {
      await runCycle();
    } catch (error) {
      console.error(`Impossible de lire tasks.json : ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, cycleDelay));
  }
}

monitorTasks();
