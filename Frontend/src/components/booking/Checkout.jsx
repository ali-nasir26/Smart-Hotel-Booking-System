import React, { useEffect, useState } from "react"
import BookingForm from "../booking/BookingForm"
import {
	FaUtensils,
	FaWifi,
	FaTv,
	FaWineGlassAlt,
	FaParking,
	FaCar,
	FaTshirt
} from "react-icons/fa"

import { useParams } from "react-router-dom"
import { getRoomById, roomPhotoDataUrl, ROOM_IMAGE_PLACEHOLDER } from "../utils/ApiFunctions"
import RoomCarousel from "../common/RoomCarousel"

const Checkout = () => {
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [roomInfo, setRoomInfo] = useState({
		photo: "",
		roomType: "",
		roomPrice: ""
	})

	const { roomId } = useParams()

	useEffect(() => {
		setTimeout(() => {
			getRoomById(roomId)
				.then((response) => {
					setRoomInfo(response)
					setIsLoading(false)
				})
				.catch((error) => {
					setError(error)
					setIsLoading(false)
				})
		}, 1000)
	}, [roomId])

	return (
		<div>
			<section className="container py-5">
				<div className="row g-4 align-items-start">
					<div className="col-lg-4">
						{isLoading ? (
							<div className="hotel-card p-4">Loading room information...</div>
						) : error ? (
							<div className="hotel-card p-4 text-danger">{error}</div>
						) : (
							<div className="hotel-card p-0 overflow-hidden">
								<img
									src={roomPhotoDataUrl(roomInfo.photo) ?? ROOM_IMAGE_PLACEHOLDER}
									alt="Room photo"
									className="hotel-room-photo"
								/>
								<div className="p-4">
									<h4 className="mb-1">{roomInfo.roomType}</h4>
									<p className="mb-3 room-price">
										${roomInfo.roomPrice} <span style={{ fontSize: "0.9em" }}>/ night</span>
									</p>
									<h6 className="hotel-label mb-2">Room Highlights</h6>
									<ul className="list-unstyled m-0 room-feature-list">
										<li>
											<FaWifi /> Wifi
										</li>
										<li>
											<FaTv /> Netflix Premium
										</li>
										<li>
											<FaUtensils /> Breakfast
										</li>
										<li>
											<FaWineGlassAlt /> Mini bar refreshment
										</li>
										<li>
											<FaCar /> Car Service
										</li>
										<li>
											<FaParking /> Parking Space
										</li>
										<li>
											<FaTshirt /> Laundry
										</li>
									</ul>
								</div>
							</div>
						)}
					</div>
					<div className="col-lg-8">
						<BookingForm />
					</div>
				</div>
			</section>
			<div className="container pb-5">
				<RoomCarousel />
			</div>
		</div>
	)
}
export default Checkout
