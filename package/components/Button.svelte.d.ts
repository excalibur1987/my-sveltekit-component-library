import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        /**
             * Is this the principal call to action on the page?
             */ primary?: boolean;
        /**
             * What background color to use
             */ backgroundColor?: string;
        /**
             * How large should the button be?
             */ size?: 'small' | 'medium' | 'large';
        /**
             * Button contents
             */ label?: string;
    };
    events: {
        click: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type ButtonProps = typeof __propDef.props;
export declare type ButtonEvents = typeof __propDef.events;
export declare type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponentTyped<ButtonProps, ButtonEvents, ButtonSlots> {
}
export {};
