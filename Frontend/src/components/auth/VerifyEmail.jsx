import React, { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { verifyEmail } from "../utils/ApiFunctions"

const VerifyEmail = () => {
	const [searchParams] = useSearchParams()
	const token = searchParams.get("token") ?? ""
	const [message, setMessage] = useState("Verifying your email...")
	const [error, setError] = useState("")
	const succeededRef = useRef(false)

	useEffect(() => {
		if (!token) {
			setError("Invalid verification link.")
			setMessage("")
			return
		}
		let cancelled = false
		verifyEmail(token)
			.then((data) => {
				if (!cancelled) {
					succeededRef.current = true
					setMessage(data.message || "Email verified successfully.")
					setError("")
				}
			})
			.catch((e) => {
				if (!cancelled && !succeededRef.current) {
					setError(e.message)
					setMessage("")
				}
			})
		return () => {
			cancelled = true
		}
	}, [token])

	return (
		<section className="container py-5">
			<div className="hotel-card p-4 p-md-5 col-12 col-md-6 mx-auto">
				{message && <p className="alert alert-success">{message}</p>}
				{error && <p className="alert alert-danger">{error}</p>}
				<div className="text-center">
					<Link to="/login">Go to Login</Link>
				</div>
			</div>
		</section>
	)
}

export default VerifyEmail
