import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

const LogoutPage = () => {
	const { handleLogout } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		handleLogout()
		navigate("/", { replace: true, state: { message: "You have been logged out." } })
	}, [handleLogout, navigate])

	return <p className="text-center mt-5">Logging out…</p>
}

export default LogoutPage
