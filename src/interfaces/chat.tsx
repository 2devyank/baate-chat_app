import { UserInterface } from "./user";

export interface ChatListIteminterface{
    admin:string;
    createdAt:string;
    isGroupChat:true;
    lastMessage?:ChatMessageInterface;
    name:string;
    participants:UserInterface[];
    updatedAt:string;
    _id:string;
}

export interface ChatMessageInterface{
_id:string ;
sender:Pick<UserInterface,"_id"|"avatar"|"email"|"username">;
content:string;
chat:string;
attachments:{
    url:string;
    localPath:string;
    publicId?:string;
    resourceType?:string;
    originalName?:string;
    _id:string;
}[];
createdAt:string;
updatedAt:string;

}

/** Payload shape for pre-uploaded attachments sent to the backend */
export interface AttachmentPayload {
  url: string;
  publicId: string;
  resourceType: string;
  originalName: string;
}
