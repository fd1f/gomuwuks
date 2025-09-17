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
import React, { useState } from "react"
import type Client from "@/api/client.ts"

interface AccessTokenLoginProps {
    homeserverURL: string
    client: Client
}

const AccessTokenLogin = ({ homeserverURL, client }: AccessTokenLoginProps) => {
    const [loading, setLoading] = useState(false)
    const [accessToken, setAccessToken] = useState("")
    const [error, setError] = useState("")

    const onChangeToken = (evt: React.ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault()
        setAccessToken(evt.target.value)
    }

    const submit = (evt: React.FormEvent) => {
        evt.preventDefault()
        setLoading(true)
        console.log(accessToken)
        client.rpc.loginAccessToken(homeserverURL, accessToken).catch(
            err => setError(`Failed to login with access token: ${err}`)
        ).finally(() => setLoading(false))
    }

    return <form onSubmit={submit} className="access-token-login">
        <h2>Access token login</h2>
        <input
            type="text"
            id="accesstoken-token"
            placeholder="Access token"
            value={accessToken}
            onChange={onChangeToken}
        />
        <button
            className="primary-color-button"
            type="submit"
            disabled={loading}
        >Login</button>
        {error && <div className="error">
            {error}
        </div>}
    </form>
}

export default AccessTokenLogin
