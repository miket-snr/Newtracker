import { Progress } from "./progress";

export class ProgressClass {
    item: Progress;
    constructor() {
        this.item = this.initdata();
    }
    initdata() {
        return {
            REFERENCE: '',
            multisite: '',
            PHASE: '',
            PROG01: ' ',
            PROG02: ' ',
            PROG03: ' ',
            PROG04: ' ',
            PROG05: ' ',
            PROG06: ' ',
            PROG07: ' ',
            PROG08: ' ',
            PROG09: ' ',
            PROG10: ' ',
            PROPSTARTDATE: '',
            PROPENDDATE: '',
            FORECAST_START: '',
            FORECAST_END: '',
            TRACKNOTE: '',
        }
    }
}