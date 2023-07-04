import { Approval } from "./approval"

export class ApprovalClass {
  approval: Approval ;

    Constructor(){
      this.approval = {
        ABSAREQNO: '',
        PROJLINK:'',
        BASELINEBUDGET: 0,
        TITLE: '',
        APPROVAL_MOTIVATE: '',
        APPROVAL_STATUS: '',
        APPROVAL_SUBMITDATE: '',
        APPROVAL_DATE: '',
        APPROVED_AMT: 0,
        APPROVAL_NOTE: '',
        PONUMBER: '',
        APPROVALTOLEGAL: '',
        APPROVEDBYLEGAL: '',
        APPTOBFMLEGAL: '',
        APPBYBFMLEGAL: '',      
        POVALUE:0,
        PODATE:'',
      } 
    }
}
