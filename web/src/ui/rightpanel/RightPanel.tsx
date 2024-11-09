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
import { JSX, use } from "react"
import type { UserID } from "@/api/types"
import MainScreenContext from "../MainScreenContext.ts"
import PinnedMessages from "./PinnedMessages.tsx"
import RoomMembers from "./RoomMembers.tsx"
import CloseButton from "@/icons/close.svg?react"
import "./RightPanel.css"

export type RightPanelType = "pinned-messages" | "members" | "user"

interface RightPanelSimpleProps {
	type: "pinned-messages" | "members"
}

interface RightPanelUserProps {
	type: "user"
	userID: UserID
}

export type RightPanelProps = RightPanelUserProps | RightPanelSimpleProps

function getTitle(type: RightPanelType): string {
	switch (type) {
	case "pinned-messages":
		return "Pinned Messages"
	case "members":
		return "Room Members"
	case "user":
		return "User Info"
	}
}

function renderRightPanelContent(props: RightPanelProps): JSX.Element | null {
	switch (props.type) {
	case "pinned-messages":
		return <PinnedMessages />
	case "members":
		return <RoomMembers />
	case "user":
		return <>{props.userID}</>
	}
}

const RightPanel = (props: RightPanelProps) => {
	return <div className="right-panel">
		<div className="right-panel-header">
			<div className="panel-name">{getTitle(props.type)}</div>
			<button onClick={use(MainScreenContext).closeRightPanel}><CloseButton/></button>
		</div>
		<div className={`right-panel-content ${props.type}`}>
			{renderRightPanelContent(props)}
		</div>
	</div>
}

export default RightPanel
