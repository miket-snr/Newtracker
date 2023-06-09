export interface dateset {
    REFERENCE?: string,
    VERSION?: string,
    ONEVIEW?: string,
    DATE01? : string,
    DATE02? : string,
    DATE03? : string,
    DATE04? : string,
    DATE05? : string,
    DATE06? : string,
    DATE07? : string,
    DATE08? : string,
    DATE09? : string,
    DATE10? : string,
    PROG01? : string,
    PROG02? : string,
    PROG03? : string,
    PROG04? : string,
    PROG05? : string,
    PROG06? : string,
    PROG07? : string,
    PROG08? : string,
    PROG09? : string,
    PROG10? : string,
    DATABAG?: string;
    CHANGEDBY?:string,
    CHANGEDON?:string,
    FORECAST_START?:string,
    FORECAST_END?:string,
    TRACKNOTE?: string,
    LAST_COMMENT?:string,
    BUDGETAMT?: number,
    RATING?: string
  }
  export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'YYYY-MM-DD',
    },
    display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};