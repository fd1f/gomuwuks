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
// import { ACLEventContent } from "@/api/types"
import EventContentProps from "./props.ts"

const ACLBody = ({ event, sender }: EventContentProps) => {
	// const content = event.content as ACLEventContent
	// const prevContent = event.unsigned.prev_content as ACLEventContent | undefined
	// TODO diff content and prevContent
	return <div className="acl-body">
		{sender?.content.displayname ?? event.sender} changed the server ACLs
	</div>
}

export default ACLBody
