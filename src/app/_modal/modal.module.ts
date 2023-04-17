import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule,FormsModule],
    declarations: [ModalComponent],
    exports: [ModalComponent]
})
export class ModalModule { }