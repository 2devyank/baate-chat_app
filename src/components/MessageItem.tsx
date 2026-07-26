import React, { useState } from 'react'
import { ChatMessageInterface } from '../interfaces/chat'
import "../styles/messagetext.css"
import moment from 'moment'

const isImageAttachment = (
  url: string,
  localPath?: string,
  originalName?: string,
  resourceType?: string
) =>
  resourceType === "image" ||
  /\.(apng|avif|gif|jpe?g|png|svg|webp)$/i.test(
    `${url.split("?")[0] || ""} ${localPath || ""} ${originalName || ""}`
  );

const getSafeAttachmentUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.pathname = parsedUrl.pathname
      .split("/")
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join("/");
    return parsedUrl.toString();
  } catch {
    return url;
  }
};

const getAttachmentName = (url: string, fallback: string) => {
  const pathname = url.split("?")[0] || fallback;
  const name = pathname.split("/").pop();
  try {
    return decodeURIComponent(name || fallback);
  } catch {
    return name || fallback;
  }
};

const MessageItem:React.FC<{
    isOwnMessage?:boolean;
    isGroupChatMessage?:boolean;
    message:ChatMessageInterface;
}>=({isOwnMessage,isGroupChatMessage,message})=> {
  const bubbleClass = isOwnMessage ? "Own" : "NotOwn";
  const [failedImageUrls, setFailedImageUrls] = useState<Set<string>>(new Set());
 
  return (
    <>
    {/* {resizedImage?(
      <div className='resize'>
        <button className='crossresize' onClick={()=>setResizedImage(null)}>
<CloseIcon/>
        </button>
        <img style={{position:"absolute",width:"500px",height:"300px"}} src={resizedImage} alt="" />
        </div>
      ):null} */}
    <div className={bubbleClass}>
{message?.attachments?.length>0?(
  <div className="attachmentsgrid">
    {
      message.attachments?.map((file)=>{
        const attachmentUrl = getSafeAttachmentUrl(file.url);
        const attachmentName =
          file.originalName || getAttachmentName(file.url, file.localPath || "Attachment");
        const shouldRenderImage =
          isImageAttachment(
            file.url,
            file.localPath,
            file.originalName,
            file.resourceType
          ) &&
          !failedImageUrls.has(attachmentUrl);
        return(
          <div className='images' key={file._id || file.url}>
            {/* <button
            className='centersearch'
            onClick={()=>setResizedImage(file.url)}
           style={{display:openvisible?"none":"block"}}
            >
<PageviewIcon fontSize="large"/>
            </button> */}
          {shouldRenderImage ? (
            <a className="messageimagepreview" href={attachmentUrl} target="_blank" rel="noreferrer">
              <img
                className="messageimage"
                src={attachmentUrl}
                alt={attachmentName}
                onError={() =>
                  setFailedImageUrls((prev) => new Set(prev).add(attachmentUrl))
                }
              />
            </a>
          ) : (
            <a className="messagefile" href={attachmentUrl} target="_blank" rel="noreferrer">
              <span aria-hidden="true">FILE</span>
              <div>
                <strong>{attachmentName}</strong>
                <small>Open attachment</small>
              </div>
            </a>
          )}
          </div>
          )
        })
      }
  </div>
):null}
    {isGroupChatMessage ? (
      <div className="messagesender">~{message.sender.username}</div>
    ) : null}
    {message.content ? <div className="messagecontent">{message.content}</div> : null}
    <time className="messagetime" dateTime={message.createdAt}>
      {moment(message.createdAt).format("h:mm A")}
    </time>
    </div>
</>
  )
}

export default MessageItem
