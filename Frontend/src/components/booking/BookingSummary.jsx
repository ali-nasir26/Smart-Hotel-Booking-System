import React, { useState, useEffect } from "react"
import moment from "moment"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"

const BookingSummary = ({ booking, payment, isFormValid, onConfirm }) => {
	const checkInDate = moment(booking.checkInDate)
	const checkOutDate = moment(booking.checkOutDate)
	const numberOfDays = checkOutDate.diff(checkInDate, "days")
	const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
	const [isProcessingPayment, setIsProcessingPayment] = useState(false)
	const navigate = useNavigate()

	const handleConfirmBooking = () => {
		setIsProcessingPayment(true)
		setTimeout(() => {
			setIsProcessingPayment(false)
			setIsBookingConfirmed(true)
			onConfirm()
		}, 3000)
	}

	useEffect(() => {
		if (isBookingConfirmed) {
			navigate("/booking-success")
		}
	}, [isBookingConfirmed, navigate])

	return (
		<div className="hotel-card p-4">
			<h4 className="card-title hotel-label mb-3">Reservation Summary</h4>

			<p className="mb-2">
				Name: <strong>{booking.guestFullName}</strong>
			</p>
			<p className="mb-2">
				Email: <strong>{booking.guestEmail}</strong>
			</p>
			<p className="mb-2">
				Check-in Date: <strong>{moment(booking.checkInDate).format("MMM Do YYYY")}</strong>
			</p>
			<p className="mb-2">
				Check-out Date: <strong>{moment(booking.checkOutDate).format("MMM Do YYYY")}</strong>
			</p>
			<p className="mb-3">
				Number of Days Booked: <strong>{numberOfDays}</strong>
			</p>

			<div className="mb-4">
				<h5 className="hotel-label mb-2">Number of Guest</h5>
				<div className="d-flex gap-3 flex-wrap">
					<div>
						Adult{booking.numOfAdults > 1 ? "s" : ""}: <strong>{booking.numOfAdults}</strong>
					</div>
					<div>
						Children: <strong>{booking.numOfChildren}</strong>
					</div>
				</div>
			</div>

			{payment > 0 ? (
				<>
					<p className="mb-3">
						Total payment: <strong>${payment}</strong>
					</p>

					{isFormValid && !isBookingConfirmed ? (
						<Button
							variant="primary"
							className="btn-hotel w-100"
							onClick={handleConfirmBooking}>
							{isProcessingPayment ? (
								<>
									<span
										className="spinner-border spinner-border-sm me-2"
										role="status"
										aria-hidden="true"></span>
									Booking Confirmed, redirecting to payment...
								</>
							) : (
								"Confirm Booking & proceed to payment"
							)}
						</Button>
					) : isBookingConfirmed ? (
						<div className="d-flex justify-content-center align-items-center">
							<div className="spinner-border text-primary" role="status">
								<span className="sr-only">Loading...</span>
							</div>
						</div>
					) : null}
				</>
			) : (
				<p className="text-danger mb-0">Check-out date must be after check-in date.</p>
			)}
		</div>
	)
}

export default BookingSummary
