import { use } from "react"
import { RoomContext } from "../roomview/roomcontext.ts"
// is this even the right thing?
import { getAvatarURL } from "@/api/media.ts"
import type { UserID, ContentURI, MemberEventContent } from "@/api/types/mxtypes.ts"
import { RoomStateStore } from "@/api/statestore/room.ts"


export interface RoomMemberEntryProps {
    userID: UserID
    avatarURL?: ContentURI
    displayName?: string
}

export interface RoomMemberCategoryProps {
    title?: string
    membership: string
}

function getMemberList(room: RoomStateStore, membership: string) {
    const members: RoomMemberEntryProps[] = []
    const states = room.state.get("m.room.member")
    console.log(
        states,
        room.eventsByRowID.get(room.state.get("m.room.power_levels")?.get("") ?? 0)
    )
    if (!states) {
        return []
    }
    for (const[stateKey, rowID] of states) {
        const memberEvt = room.eventsByRowID.get(rowID)
        if (!memberEvt) {
            continue
        }
        const content = memberEvt.content as MemberEventContent
        if (content.membership == membership) {
            members.push({
                userID: stateKey,
                avatarURL: content.avatar_url,
                displayName: content.displayname
            })
        }
    }
    return members
}

const RoomMemberEntry = (props: RoomMemberEntryProps) => {
    return (<div className="room-member">
        <img
            className="avatar"
            loading="lazy"
            src={getAvatarURL(props.userID, {displayname: props.displayName, avatar_url: props.avatarURL})}
        />
        <span>{props.displayName ?? props.userID}</span>
    </div>)
}

const RoomMemberCategory = (props: RoomMemberCategoryProps) => {
    const roomCtx = use(RoomContext)
    if (!roomCtx) {
        return null
    }
    const members = getMemberList(roomCtx.store, props.membership)
    console.log(members)
    let list = members.map(member => 
        <RoomMemberEntry userID={member.userID} avatarURL={member.avatarURL} displayName={member.displayName}/>
    )
    if (list.length === 0) {
        return null
    }
    return <>
        {props.title ? <p>{props.title}</p> : null}
        <div className="member-list">{list}</div>
    </>
}

const RoomMembers = () => {
    return <>
        <RoomMemberCategory membership="join" />
        <RoomMemberCategory membership="invite" title="Invited" />
    </>
}

export default RoomMembers