export interface FTRANSFER {
    LEVEL: number,
    POSITION: string,
    VALUE_TYPE: string,
    BUDGET_CATEGORY: string,
    VALUE: number,
    VALUE_DISTRIBUTED: number
  }

  export interface FLINE {
    name: string, 
    children:FLINE[], 
    showme: boolean,
    value: number, 
    valuedistributed: number,
    budgetcat: string, 
    level: number
  }
 
  export interface IMLINE {
    name: string, 
    children:IMLINE[], 
    showme: boolean,
    request:string,
    appreq:string,
    proj: string,
    imcode:string,
    arcode:string,
    pspnr: string,
    posnr: string,
    parent: string,
    title: string,
    basevalue: number,
    lastvalue:number
  }
  export interface Option {
    name: string;
    value: string;
    checked: boolean;
  }