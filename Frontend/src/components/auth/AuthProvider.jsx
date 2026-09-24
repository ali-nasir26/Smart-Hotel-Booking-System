import React, { createContext, useState, useContext } from "react"
import jwt_decode from "jwt-decode"

export const AuthContext = createContext({
	user: null,
	handleLogin: (token, email, roles) => {},
	handleLogout: () => {}
})

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)

	const handleLogin = (token, email, roles = []) => {
		const decodedUser = jwt_decode(token)
		localStorage.setItem("userId", email || decodedUser.sub)
		localStorage.setItem("userRole", JSON.stringify(roles))
		localStorage.setItem("token", token)
		setUser({ ...decodedUser, email: email || decodedUser.sub, roles })
	}

	const handleLogout = () => {
		localStorage.removeItem("userId")
		localStorage.removeItem("userRole")
		localStorage.removeItem("token")
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}

