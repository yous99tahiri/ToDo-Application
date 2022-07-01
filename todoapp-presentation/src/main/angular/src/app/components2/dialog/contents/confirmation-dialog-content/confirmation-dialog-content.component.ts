import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageBoxParent } from '../../../message-box/message-box-parent';

@Component({
  selector: 'app-confirmation-dialog-content',
  templateUrl: './confirmation-dialog-content.component.html',
  styleUrls: ['./confirmation-dialog-content.component.sass']
})
//<T>
export class ConfirmationDialogContentComponent extends MessageBoxParent{

  ret:ConfirmationDialogOutputData =  {confirmed:false}
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogInputData) { 
    super()
    console.log("ConfirmationDialogContentComponent: created")
    console.log("Injected data: ",data)
  }

  accept(): void{
    this.ret.confirmed = true;
    this.dialogRef.close(this.ret)
  }

  cancel(): void{
    this.ret.confirmed = false;
    this.dialogRef.close(this.ret)
  }
}

//<D>
export type ConfirmationDialogInputData = {
  question:string
  //...
}

//<R>
export type ConfirmationDialogOutputData = {
  confirmed:boolean
  //...
}