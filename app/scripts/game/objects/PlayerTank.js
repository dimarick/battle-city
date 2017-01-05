import Tank, {TankDirection} from './Tank';
import Commands from '../input/Commands';
import CommandGroup from '../input/CommandGroup';

export default class PlayerTank extends Tank {
    /**
     * @param {TankTypeTileRegistry} tankColorTiles
     * @param x
     * @param y
     * @param direction
     */
    constructor(tankColorTiles, x, y, direction) {
        super(tankColorTiles.player, x, y, direction);
    }

    /**
     * @param {Scene} scene
     */
    onAttach(scene) {
        super.onAttach(scene);

        const commandGroup = new CommandGroup({
            up: {start: () => this.commandUp(), stop: () => this.commandStop()},
            down: {start: () => this.commandDown(), stop: () => this.commandStop()},
            left: {start: () => this.commandLeft(), stop: () => this.commandStop()},
            right: {start: () => this.commandRight(), stop: () => this.commandStop()}
        });

        scene.eventManager.subscribe(this, Commands.up.start, () => commandGroup.startCommand('up'));
        scene.eventManager.subscribe(this, Commands.up.stop, () => commandGroup.stopCommand('up'));
        scene.eventManager.subscribe(this, Commands.down.start, () => commandGroup.startCommand('down'));
        scene.eventManager.subscribe(this, Commands.down.stop, () => commandGroup.stopCommand('down'));
        scene.eventManager.subscribe(this, Commands.left.start, () => commandGroup.startCommand('left'));
        scene.eventManager.subscribe(this, Commands.left.stop, () => commandGroup.stopCommand('left'));
        scene.eventManager.subscribe(this, Commands.right.start, () => commandGroup.startCommand('right'));
        scene.eventManager.subscribe(this, Commands.right.stop, () => commandGroup.stopCommand('right'));

        scene.eventManager.subscribe(this, Commands.fire.start, () => this.commandFireStart());
        scene.eventManager.subscribe(this, Commands.fire.stop, () => this.commandFireStop());
    }

    commandUp() {
        this.changeDirection(1, TankDirection.up);
    }
    commandDown() {
        this.changeDirection(1, TankDirection.down);
    }
    commandLeft() {
        this.changeDirection(1, TankDirection.left);
    }
    commandRight() {
        this.changeDirection(1, TankDirection.right);
    }
    commandStop() {
        this.changeDirection(0);
    }

    commandFireStart() {
        if (this.firing !== undefined) {
            return;
        }

        this.firing = setInterval(() => this.fire(), 1000 / 4);
        this.fire();
    }
    commandFireStop() {
        clearInterval(this.firing);

        delete this.firing;
    }

    finishFire(object) {
        super.finishFire(object);
        if (this.firing !== undefined) {
            this.fire();
        }
    }
}