import EventEmitter from "../../utils/eventemitter/EventEmitter";

export default FSM;

declare namespace FSM {

    interface IStateConfig {
        name?: string,
        next?: string | (() => string),
        enter?: Function,
        exit?: Function,
    }

    interface IConfig {
        start?: string,
        states?: { [name: string]: IStateConfig },

        init?: Function,

        extend?: {
            [name: string]: any,
        },

        enable?: boolean,

        eventEmitter?: EventEmitter | false,
    }

    namespace Events {
        type StateChangeCallbackType = (state: FSM) => void;
        type ExitStateCallbackType = (state: FSM) => void;
        type EnterStateCallbackType = (state: FSM) => void;
    }
}

declare class FSM extends EventEmitter {
    constructor(config?: FSM.IConfig);

    start(newState: string): this;
    next(): this;
    goto(nextState: string): this;
    state: string;
    readonly prevState: string;

    setEnable(enable?: boolean): this;
    toggleEnable(): this;
    enable: boolean;

    addState(
        name: string,
        state: FSM.IStateConfig
    ): this;
    addState(state: FSM.IStateConfig): this;

    addStates(
        states: { [name: string]: FSM.IStateConfig },
    ): this;
    addStates(
        states: FSM.IStateConfig[]
    ): this;

    runMethod(
        methodName: string,
        ...args: unknown[]
    ): unknown;

    update(
        time: number,
        delta: number
    ): void;

    preupdate(
        time: number,
        delta: number
    ): void;

    postupdate(
        time: number,
        delta: number
    ): void;
}