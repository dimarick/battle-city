/**
 * Provide object keyboard handler isolation from wild world with ugly users, wanna press all keys
 */
export default class CommandGroup {
    constructor(commandHandlers) {
        this.commandHandlers = commandHandlers;
        this.activeCommands = new Set();
        this.currentCommand = null;
    }

    startCommand(command) {
        if (this.currentCommand !== null) {
            this.commandHandlers[this.currentCommand].stop(command);
        }
        this.activeCommands.delete(command);
        this.activeCommands.add(command);
        this.commandHandlers[command].start(command);
        this.currentCommand = command
    }

    stopCommand(command) {
        this.activeCommands.delete(command);
        this.commandHandlers[command].stop(command);
        if (command === this.currentCommand) {
            this.commandHandlers[this.currentCommand].stop(command);
        }

        const activeCommandsArray = [...this.activeCommands];
        const prevCommand = activeCommandsArray.pop();

        if (prevCommand !== undefined) {
            this.startCommand(prevCommand);
        }
    }
}