const createPath = (source, dest) => ({ source, dest });
const createCommand = (command) => ({ command, options: { stdio: 'inherit' } });

module.exports = {
  createPath,
  createCommand
};