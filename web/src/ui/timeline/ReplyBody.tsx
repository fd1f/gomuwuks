// gomuks - A Matrix client written in Go.
// Copyright (C) 2024 Tulir Asokan
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import { use } from "react"
import { getAvatarURL, getUserColorIndex } from "@/api/media.ts"
import { RoomStateStore, useRoomEvent, useRoomMember } from "@/api/statestore"
import type { EventID, MemDBEvent, MemberEventContent } from "@/api/types"
import { getDisplayname } from "@/util/validation.ts"
import ClientContext from "../ClientContext.ts"
import TooltipButton from "../util/TooltipButton.tsx"
import { ContentErrorBoundary, getBodyType } from "./content"
import CloseIcon from "@/icons/close.svg?react"
import NotificationsOffIcon from "@/icons/notifications-off.svg?react"
import NotificationsIcon from "@/icons/notifications.svg?react"
import ReplyIcon from "@/icons/reply.svg?react"
import ThreadIcon from "@/icons/thread.svg?react"
import "./ReplyBody.css"

interface ReplyBodyProps {
	room: RoomStateStore
	event: MemDBEvent
	isThread: boolean
	small?: boolean
	isEditing?: boolean
	onClose?: (evt: React.MouseEvent) => void
	isSilent?: boolean
	onSetSilent?: (evt: React.MouseEvent) => void
	isExplicitInThread?: boolean
	onSetExplicitInThread?: (evt: React.MouseEvent) => void
}

interface ReplyIDBodyProps {
	room: RoomStateStore
	eventID: EventID
	isThread: boolean
	small: boolean
}

export const ReplyIDBody = ({ room, eventID, isThread, small }: ReplyIDBodyProps) => {
	const event = useRoomEvent(room, eventID)
	if (!event) {
		// This caches whether the event is requested or not, so it doesn't need to be wrapped in an effect.
		use(ClientContext)!.requestEvent(room, eventID)
		return <blockquote className="reply-body">
			Reply to unknown event<br/><code>{eventID}</code>
		</blockquote>
	}
	return <ReplyBody room={room} event={event} isThread={isThread} small={small}/>
}

const onClickReply = (evt: React.MouseEvent) => {
	const targetEvt = document.querySelector(
		`div[data-event-id="${CSS.escape(evt.currentTarget.getAttribute("data-reply-to") ?? "")}"]`,
	)
	if (targetEvt) {
		targetEvt.scrollIntoView({
			block: "center",
		})
		targetEvt.classList.add("jump-highlight")
		setTimeout(() => {
			targetEvt.classList.add("jump-highlight-fadeout")
			targetEvt.classList.remove("jump-highlight")
			setTimeout(() => {
				targetEvt.classList.remove("jump-highlight-fadeout")
			}, 1500)
		}, 3000)
	}
}

export const ReplyBody = ({
	room, event, onClose, isThread, isEditing, isSilent, onSetSilent, isExplicitInThread, onSetExplicitInThread, small,
}: ReplyBodyProps) => {
	const client = use(ClientContext)
	const memberEvt = useRoomMember(client, room, event.sender)
	const memberEvtContent = memberEvt?.content as MemberEventContent | undefined
	const BodyType = getBodyType(event, true)
	const classNames = ["reply-body"]
	if (onClose) {
		classNames.push("composer")
	}
	if (isThread) {
		classNames.push("thread")
	}
	if (isEditing) {
		classNames.push("editing")
	}
	if (small) {
		classNames.push("small")
	}
	const userColorIndex = getUserColorIndex(event.sender)
	classNames.push(`sender-color-${userColorIndex}`)
	return <blockquote data-reply-to={event.event_id} className={classNames.join(" ")} onClick={onClickReply}>
		{small && <div className="reply-spine"/>}
		<div className="reply-sender">
			<div className="sender-avatar" title={event.sender}>
				<img
					className="small avatar"
					loading="lazy"
					src={getAvatarURL(event.sender, memberEvtContent)}
					alt=""
				/>
			</div>
			<span className={`event-sender sender-color-${userColorIndex}`}>
				{getDisplayname(event.sender, memberEvtContent)}
			</span>
			{onClose && <div className="buttons">
				{onSetSilent && (isExplicitInThread || !isThread) && <TooltipButton
					tooltipText={isSilent
						? "Click to enable pinging the original author"
						: "Click to disable pinging the original author"}
					tooltipDirection="left"
					className="silent-reply"
					onClick={onSetSilent}
				>
					{isSilent ? <NotificationsOffIcon /> : <NotificationsIcon />}
				</TooltipButton>}
				{isThread && onSetExplicitInThread && <TooltipButton
					tooltipText={isExplicitInThread
						? "Click to respond in thread without replying to a specific message"
						: "Click to reply explicitly in thread"}
					tooltipDirection="left"
					className="thread-explicit-reply"
					onClick={onSetExplicitInThread}
				>
					{isExplicitInThread ? <ReplyIcon /> : <ThreadIcon />}
				</TooltipButton>}
				{onClose && <button className="close-reply" onClick={onClose}><CloseIcon/></button>}
			</div>}
		</div>
		<ContentErrorBoundary>
			<BodyType room={room} event={event} sender={memberEvt}/>
		</ContentErrorBoundary>
	</blockquote>
}
