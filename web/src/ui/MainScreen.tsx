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
import { use, useCallback, useState } from "react"
import type { RoomID } from "@/api/types"
import { ClientContext } from "./ClientContext.ts"
import RoomView from "./RoomView.tsx"
import RoomList from "./roomlist/RoomList.tsx"
import "./MainScreen.css"

const MainScreen = () => {
	const [activeRoomID, setActiveRoomID] = useState<RoomID | null>(null)
	const client = use(ClientContext)!
	const activeRoom = activeRoomID && client.store.rooms.get(activeRoomID)
	const roomList = client.store.roomList
	const setActiveRoom = useCallback((roomID: RoomID) => {
		setActiveRoomID(roomID)
		if (client.store.rooms.get(roomID)?.stateLoaded === false) {
			client.loadRoomState(roomID)
				.catch(err => console.error("Failed to load room state", err))
		}
	}, [client])
	client.store.switchRoom = setActiveRoom
	const clearActiveRoom = useCallback(() => setActiveRoomID(null), [])
	const onKeyDownShortcuts = (evt: React.KeyboardEvent) => {
		if (evt.altKey && (evt.key === "ArrowDown" || evt.key === "ArrowUp")) {
			let direction = evt.key === "ArrowUp" ? 1 : -1 
			// populate the list
			let roomIDList: RoomID[] = []
			roomList.current.forEach((e) => {roomIDList.push(e.room_id)})
			// if no room is active, default to the last one in the array (top of the room list)
			let nextIndex = roomIDList.length - 1
			if (activeRoomID) {
				nextIndex = roomIDList.indexOf(activeRoomID) + direction
				// wraparound
				if (nextIndex >= roomIDList.length) {
					nextIndex = 0
				} else if (nextIndex < 0) {
					nextIndex = roomIDList.length - 1
				}
			}
			console.log("we are currently on", activeRoomID)
			console.log("this would switch to", roomIDList[nextIndex], roomList)
			setActiveRoom(roomIDList[nextIndex])
		}
	}
	return <main className={`matrix-main ${activeRoom ? "room-selected" : ""}`} onKeyDown={onKeyDownShortcuts}>
		<RoomList setActiveRoom={setActiveRoom} activeRoomID={activeRoomID} />
		{activeRoom && <RoomView key={activeRoomID} clearActiveRoom={clearActiveRoom} room={activeRoom} />}
	</main>
}

export default MainScreen
