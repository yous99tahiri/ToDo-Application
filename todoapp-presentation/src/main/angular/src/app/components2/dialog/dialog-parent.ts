import { ComponentType } from "@angular/cdk/portal";
import { TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { MessageBoxParent } from "../message-box/message-box-parent";
import { ConfirmationDialogContentComponent, ConfirmationDialogInputData, ConfirmationDialogOutputData } from "./contents/confirmation-dialog-content/confirmation-dialog-content.component";
import { ItemCreationDialogContentComponent, ItemCreationDialogInputData, ItemCreationDialogOutputData } from "./contents/item-creation-dialog-content/item-creation-dialog-content.component";
import { ItemDetailsDialogContentComponent, ItemDetailsDialogInputData, ItemDetailsDialogOutputData } from "./contents/item-details-dialog-content/item-details-dialog-content.component";
import { ListCreationDialogContentComponent, ListCreationDialogInputData, ListCreationDialogOutputData } from "./contents/list-creation-dialog-content/list-creation-dialog-content.component";

export class DialogParent extends MessageBoxParent{

    constructor(public dialog: MatDialog){
        super()
    }

    //lets use some generics :)
    openDialog<T,D,R>(classRef:ComponentType<T>|TemplateRef<T>,data:D):Observable<R | undefined> {
        const dialogRef = this.dialog.open<T,D,R>(classRef,{data:data});
        return dialogRef.afterClosed();
    }

    //and make life easier
    openConfirmationDialog(data:ConfirmationDialogInputData):Observable<ConfirmationDialogOutputData | undefined>{
        return this.openDialog<ConfirmationDialogContentComponent,
        ConfirmationDialogInputData,
        ConfirmationDialogOutputData>(ConfirmationDialogContentComponent,data)
    }

    openItemDetailsDialog(data:ItemDetailsDialogInputData):Observable<ItemDetailsDialogOutputData | undefined>{
        return this.openDialog<ItemDetailsDialogContentComponent,
        ItemDetailsDialogInputData,
        ItemDetailsDialogOutputData>(ItemDetailsDialogContentComponent,data)
    }
    
    openItemCreationDialog(data:ItemCreationDialogInputData):Observable<ItemCreationDialogOutputData | undefined>{
        return this.openDialog<ItemCreationDialogContentComponent,
        ItemCreationDialogInputData,
        ItemCreationDialogOutputData>(ItemCreationDialogContentComponent,data);
    }

    openListCreationDialog(data:ListCreationDialogInputData):Observable<ListCreationDialogOutputData | undefined>{
        return this.openDialog<ListCreationDialogContentComponent,
        ListCreationDialogInputData,
        ListCreationDialogOutputData>(ListCreationDialogContentComponent,{});
    }
    
}
