import { use } from "react"
//import { useRoomState } from "@/api/statestore"
import { RoomContext } from "../roomview/roomcontext.ts"
// this works for testing but i'll need to check with tulir that it's suitable
import { getAutocompleteMemberList } from "../composer/userautocomplete"
import { getAvatarURL } from "@/api/media.ts"
//import type { MemberEventContent } from "@/api/types"
import type { UserID, ContentURI } from "@/api/types/mxtypes.ts"


// that might need to be an exported interface. what is an interface?? lol
type RoomMemberEntryProps = {
    userID: UserID,
    avatarURL?: ContentURI,
    displayname?: string, 
}


// clean it up to match how components are usually made
const RoomMemberEntry = (props: RoomMemberEntryProps) => {
    return (<div>
        <img
            className="avatar"
            loading="lazy"
            src={getAvatarURL(props.userID, {displayname: props.displayname, avatar_url: props.avatarURL})}
        />
        {props.displayname ?? props.userID}
    </div>)
}

const RoomMembers = () => {
    const roomCtx = use(RoomContext)
    if (!roomCtx) {
        return null
    }
    const members = getAutocompleteMemberList(roomCtx.store)
    console.log(members)
    let list = Array()
    members.forEach((member) => {
        list.push(
            // lol `?? "" is to shut typescript warnings up. need to look into that
            <RoomMemberEntry userID={member.userID} avatarURL={member.avatarURL} displayname={member.displayName}/>
        )
    })
    return <ul>{list}</ul>
}

export default RoomMembers