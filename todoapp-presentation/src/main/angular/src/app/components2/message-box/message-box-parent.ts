import { AlertType, MessageModel } from './message-box.component';
export class MessageBoxParent{
    messageModel:MessageModel = {
        message:"",
        type:AlertType.SUCCESS,
    }

    showMessage(message:string,type:AlertType):void{
        this.messageModel = {
            message:message,
            type:type
        }
    }

    showSuccessMessage(message:string):void{
        this.showMessage(message,AlertType.SUCCESS)
    }

    showDangerMessage(message:string):void{
        this.showMessage(message,AlertType.DANGER)
    }

    //...
}