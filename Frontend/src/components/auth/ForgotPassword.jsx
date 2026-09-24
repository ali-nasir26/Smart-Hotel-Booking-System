import React, { useState } from "react"
import { forgotPassword } from "../utils/ApiFunctions"

const ForgotPassword = () => {
	const [email, setEmail] = useState("")
	const [message, setMessage] = useState("")
	const [error, setError] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await forgotPassword(email)
			setMessage(response.message || "Reset link sent.")
			setError("")
		} catch (e2) {
			setError(e2.message)
			setMessage("")
		}
	}

	return (
		<section className="container py-5">
			<div className="hotel-card p-4 p-md-5 col-12 col-md-6 mx-auto">
				<h2 className="hotel-label mb-4">Forgot Password</h2>
				{message && <p className="alert alert-success">{message}</p>}
				{error && <p className="alert alert-danger">{error}</p>}
				<form onSubmit={handleSubmit}>
					<input
						type="email"
						className="form-control mb-3"
						placeholder="Enter your account email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<button type="submit" className="btn btn-hotel w-100">
						Send Reset Link
					</button>
				</form>
			</div>
		</section>
	)
}

export default ForgotPassword
