'use strict';

const readline = require('node:readline/promises');

const confirmRefund = async ({
  input = process.stdin,
  output = process.stdout,
  createInterface = readline.createInterface,
} = {}) => {
  if (!input.isTTY || input.destroyed || input.readableEnded) {
    return false;
  }

  let interface_;
  try {
    interface_ = createInterface({ input, output });
    const closed = new Promise((resolve) => {
      interface_.once('close', () => resolve(undefined));
    });
    while (true) {
      const answer = await Promise.race([
        interface_.question('Confirmer le remboursement ? o/n '),
        closed,
      ]);
      if (answer === 'o') return true;
      if (answer === 'n') return false;
      if (answer === undefined || input.destroyed || input.readableEnded) return false;
    }
  } catch {
    return false;
  } finally {
    interface_?.close();
  }
};

module.exports = { confirmRefund };
