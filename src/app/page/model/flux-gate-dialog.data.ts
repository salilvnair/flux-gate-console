import { BehaviorSubject } from "rxjs";
import { DataRow, Rule } from "src/app/api/app/model/flux-gate.response";

export interface ConfigDialogData {
    configId: string;
    title: string;
    data: BehaviorSubject<DataRow[]>;
}

export interface RuleDialogData {
    title: string;
    data: BehaviorSubject<Rule[]>;
    groupedRules: boolean;
}