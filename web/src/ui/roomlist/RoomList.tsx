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
import React, { use, useCallback, useRef, useState } from "react"
import { RoomListFilter } from "@/api/statestore/space.ts"
import type { RoomID } from "@/api/types"
import { useEventAsState } from "@/util/eventdispatcher.ts"
import reverseMap from "@/util/reversemap.ts"
import toSearchableString from "@/util/searchablestring.ts"
import ClientContext from "../ClientContext.ts"
import MainScreenContext from "../MainScreenContext.ts"
import { keyToString } from "../keybindings.ts"
import Entry from "./Entry.tsx"
import FakeSpace from "./FakeSpace.tsx"
import Space from "./Space.tsx"
import CloseIcon from "@/icons/close.svg?react"
import SearchIcon from "@/icons/search.svg?react"
import "./RoomList.css"

interface RoomListProps {
	activeRoomID: RoomID | null
}

const RoomList = ({ activeRoomID }: RoomListProps) => {
	const client = use(ClientContext)!
	const mainScreen = use(MainScreenContext)
	const roomList = useEventAsState(client.store.roomList)
	const spaces = useEventAsState(client.store.topLevelSpaces)
	const searchInputRef = useRef<HTMLInputElement>(null)
	const [query, directSetQuery] = useState("")
	const [space, directSetSpace] = useState<RoomListFilter | null>(null)

	const setQuery = (evt: React.ChangeEvent<HTMLInputElement>) => {
		client.store.currentRoomListQuery = toSearchableString(evt.target.value)
		directSetQuery(evt.target.value)
	}
	const setSpace = useCallback((space: RoomListFilter | null) => {
		directSetSpace(space)
		client.store.currentRoomListFilter = space
	}, [client])
	const onClickSpace = useCallback((evt: React.MouseEvent<HTMLDivElement>) => {
		const store = client.store.getSpaceStore(evt.currentTarget.getAttribute("data-target-space")!)
		setSpace(store)
	}, [setSpace, client])
	const clearQuery = () => {
		client.store.currentRoomListQuery = ""
		directSetQuery("")
		searchInputRef.current?.focus()
	}
	const onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
		const key = keyToString(evt)
		if (key === "Escape") {
			clearQuery()
			evt.stopPropagation()
			evt.preventDefault()
		} else if (key === "Enter") {
			const roomList = client.store.getFilteredRoomList()
			mainScreen.setActiveRoom(roomList[roomList.length-1]?.room_id)
			clearQuery()
			evt.stopPropagation()
			evt.preventDefault()
		}
	}

	const roomListFilter = client.store.roomListFilterFunc
	return <div className="room-list-wrapper">
		<div className="room-search-wrapper">
			<input
				value={query}
				onChange={setQuery}
				onKeyDown={onKeyDown}
				className="room-search"
				type="text"
				placeholder="Search rooms"
				ref={searchInputRef}
				id="room-search"
			/>
			<button onClick={clearQuery} disabled={query === ""}>
				{query !== "" ? <CloseIcon/> : <SearchIcon/>}
			</button>
		</div>
		<div className="space-bar">
			<FakeSpace space={null} setSpace={setSpace} isActive={space === null} />
			{client.store.pseudoSpaces.map(pseudoSpace => <FakeSpace
				key={pseudoSpace.id}
				space={pseudoSpace}
				setSpace={setSpace}
				isActive={space?.id === pseudoSpace.id}
			/>)}
			{spaces.map(roomID => <Space
				key={roomID}
				roomID={roomID}
				client={client}
				onClick={onClickSpace}
				isActive={space?.id === roomID}
			/>)}
		</div>
		<div className="room-list">
			{reverseMap(roomList, room =>
				<Entry
					key={room.room_id}
					isActive={room.room_id === activeRoomID}
					hidden={roomListFilter ? !roomListFilter(room) : false}
					room={room}
				/>,
			)}
		</div>
	</div>
}

export default RoomList
