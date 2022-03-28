import { SvelteComponentTyped } from "svelte";
declare class __sveltets_Render<T> {
    props(): {
        maxShowCount?: number;
        options: {
            choices: string[];
        } | {
            choices: T[];
            valueKey: string;
            groupBy?: string;
            groupByKeys?: string[];
        };
        selected?: (string | object)[];
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export declare type MultiSelectGroupingProps<T> = ReturnType<__sveltets_Render<T>['props']>;
export declare type MultiSelectGroupingEvents<T> = ReturnType<__sveltets_Render<T>['events']>;
export declare type MultiSelectGroupingSlots<T> = ReturnType<__sveltets_Render<T>['slots']>;
export default class MultiSelectGrouping<T> extends SvelteComponentTyped<MultiSelectGroupingProps<T>, MultiSelectGroupingEvents<T>, MultiSelectGroupingSlots<T>> {
}
export {};
