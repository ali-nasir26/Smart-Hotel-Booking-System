import React, { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { resetPassword } from "../utils/ApiFunctions"

const ResetPassword = () => {
	const [searchParams] = useSearchParams()
	const [newPassword, setNewPassword] = useState("")
	const [message, setMessage] = useState("")
	const [error, setError] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		const token = searchParams.get("token")
		if (!token) {
			setError("Invalid reset link.")
			return
		}
		try {
			const response = await resetPassword(token, newPassword)
			setMessage(response.message || "Password reset successful.")
			setError("")
			setNewPassword("")
		} catch (e2) {
			setError(e2.message)
			setMessage("")
		}
	}

	return (
		<section className="container py-5">
			<div className="hotel-card p-4 p-md-5 col-12 col-md-6 mx-auto">
				<h2 className="hotel-label mb-4">Reset Password</h2>
				{message && <p className="alert alert-success">{message}</p>}
				{error && <p className="alert alert-danger">{error}</p>}
				<form onSubmit={handleSubmit}>
					<input
						type="password"
						className="form-control mb-3"
						placeholder="Enter new password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						minLength={8}
						required
					/>
					<button type="submit" className="btn btn-hotel w-100">
						Update Password
					</button>
				</form>
				<div className="text-center mt-3">
					<Link to="/login">Back to Login</Link>
				</div>
			</div>
		</section>
	)
}

export default ResetPassword
