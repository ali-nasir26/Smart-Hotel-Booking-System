import React, { useState } from "react"
import moment from "moment"
import { cancelBooking, getBookingByConfirmationCode } from "../utils/ApiFunctions"

const FindBooking = () => {
	const [confirmationCode, setConfirmationCode] = useState("")
	const [error, setError] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [bookingInfo, setBookingInfo] = useState({
		id: "",
		bookingConfirmationCode: "",
		room: { id: "", roomType: "" },
		roomNumber: "",
		checkInDate: "",
		checkOutDate: "",
		guestName: "",
		guestEmail: "",
		numOfAdults: "",
		numOfChildren: "",
		totalNumOfGuests: ""
	})

	const emptyBookingInfo = {
		id: "",
		bookingConfirmationCode: "",
		room: { id: "", roomType: "" },
		roomNumber: "",
		checkInDate: "",
		checkOutDate: "",
		guestName: "",
		guestEmail: "",
		numOfAdults: "",
		numOfChildren: "",
		totalNumOfGuests: ""
	}
	const [isDeleted, setIsDeleted] = useState(false)

	const handleInputChange = (event) => {
		setConfirmationCode(event.target.value)
	}

	const handleFormSubmit = async (event) => {
		event.preventDefault()
		setIsLoading(true)

		try {
			const data = await getBookingByConfirmationCode(confirmationCode)
			setBookingInfo(data)
			setError(null)
		} catch (error) {
			setBookingInfo(emptyBookingInfo)
			if (error.response && error.response.status === 404) {
				setError(error.response.data.message)
			} else {
				setError(error.message)
			}
		}

		setTimeout(() => setIsLoading(false), 3000)
	}

	const handleBookingCancellation = async (bookingId) => {
		try {
			await cancelBooking(bookingInfo.id)
			setIsDeleted(true)
			setSuccessMessage("Booking has been cancelled successfully!")
			setBookingInfo(emptyBookingInfo)
			setConfirmationCode("")
			setError(null)
		} catch (error) {
			setError(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setIsDeleted(false)
		}, 2000)
	}

	return (
		<>
			<div className="container py-5">
				<div className="hotel-card p-4 p-md-5">
					<h2 className="text-center mb-4">Find My Booking</h2>
					<form onSubmit={handleFormSubmit} className="col-md-6 mx-auto">
						<div className="input-group mb-3">
							<input
								className="form-control"
								type="text"
								id="confirmationCode"
								name="confirmationCode"
								value={confirmationCode}
								onChange={handleInputChange}
								placeholder="Enter the booking confirmation code"
							/>

							<button type="submit" className="btn btn-hotel input-group-text">
								Find booking
							</button>
						</div>
					</form>

					{isLoading ? (
						<div className="text-center">Finding your booking...</div>
					) : error ? (
						<div className="text-danger text-center">Error: {error}</div>
					) : bookingInfo.bookingConfirmationCode ? (
						<div className="mt-4">
							<h3 className="mb-3">Booking Information</h3>
							<p className="text-success mb-1">
								Confirmation Code: {bookingInfo.bookingConfirmationCode}
							</p>
							<p className="mb-1">Room Number: {bookingInfo.room.id}</p>
							<p className="mb-1">Room Type: {bookingInfo.room.roomType}</p>
							<p className="mb-1">
								Check-in Date:{" "}
								{moment(bookingInfo.checkInDate).subtract(1, "month").format("MMM Do, YYYY")}
							</p>
							<p className="mb-1">
								Check-out Date:{" "}
								{moment(bookingInfo.checkInDate).subtract(1, "month").format("MMM Do, YYYY")}
							</p>
							<p className="mb-1">Full Name: {bookingInfo.guestName}</p>
							<p className="mb-1">Email Address: {bookingInfo.guestEmail}</p>
							<p className="mb-1">Adults: {bookingInfo.numOfAdults}</p>
							<p className="mb-1">Children: {bookingInfo.numOfChildren}</p>
							<p className="mb-3">Total Guest: {bookingInfo.totalNumOfGuests}</p>

							{!isDeleted && (
								<button
									onClick={() => handleBookingCancellation(bookingInfo.id)}
									className="btn btn-danger">
									Cancel Booking
								</button>
							)}
						</div>
					) : (
						<div className="text-center">find booking...</div>
					)}

					{isDeleted && (
						<div className="alert alert-success mt-3 fade show">{successMessage}</div>
					)}
				</div>
			</div>
		</>
	)
}

export default FindBooking
