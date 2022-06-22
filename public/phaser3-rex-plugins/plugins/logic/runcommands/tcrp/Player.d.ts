import EventEmitter from "../../../utils/eventemitter/EventEmitter";

export default Player;

declare namespace Player {
    type TimeUnitType = 0 | 1 | 'ms' | 's' | 'sec';
    type DtModeType = 0 | 1 | 'abs' | 'absolute' | 'inc' | 'increment';

    interface IConfig {
        timeUnit?: TimeUnitType
        dtMode?: DtModeType,
        commands?: any[],
        timeScale?: number,
        scope?: object,

        eventEmitter?: EventEmitter | false,
    }

    interface ILoadConfig {
        timeUnit?: TimeUnitType
        dtMode?: DtModeType,
    }

    namespace Events {
        type CompleteCallbackType = (
            parent: Phaser.Scene | Phaser.GameObjects.GameObject,
            player: Player
        ) => void;

        type RunCommandCallbackType = (command: any[], scope: object) => void;
    }
}

declare class Player extends EventEmitter {
    constructor(
        parent: Phaser.Scene | Phaser.GameObjects.GameObject,
        config?: Player.IConfig
    );

    load(
        commands: any[],
        scope?: object,
        config?: Player.ILoadConfig
    ): this;

    start(startAt?: number): this;

    pause(): this;
    resume(): this;
    stop(): this;

    seek(time: number): this;

    readonly isPlaying: boolean;
    readonly completed: boolean;
    readonly now: number;

    setTimeScale(timeScale: number): this;
    timeScale: number;
}