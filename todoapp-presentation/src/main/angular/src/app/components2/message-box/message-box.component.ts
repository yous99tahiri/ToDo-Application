import { Component, Input } from '@angular/core';

@Component({
  selector: 'wt2-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.sass']
})
export class MessageBoxComponent{

  @Input() messageModel:MessageModel = {
    message : "",
    type:AlertType.SUCCESS
  }
}

export interface MessageModel {
  message : string,
  type:AlertType
}

export enum AlertType{
  DANGER = "",
  SUCCESS = ""
}
