import React from "react"
import { Card, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { roomPhotoDataUrl, ROOM_IMAGE_PLACEHOLDER } from "../utils/ApiFunctions"

const RoomCard = ({ room }) => {
	return (
		<Col key={room.id} className="mb-4" xs={12}>
			<Card className="hotel-card">
				<Card.Body className="d-flex flex-wrap align-items-center">
					<div className="flex-shrink-0 me-3 mb-3 mb-md-0">
						<Link to={`/book-room/${room.id}`}>
							<Card.Img
								variant="top"
								src={roomPhotoDataUrl(room.photo) ?? ROOM_IMAGE_PLACEHOLDER}
								alt="Room Photo"
								className="hotel-room-thumb"
							/>
						</Link>
					</div>
					<div className="flex-grow-1 ms-3">
						<Card.Title className="hotel-color">{room.roomType}</Card.Title>
						<Card.Title className="room-price">{room.roomPrice} / night</Card.Title>
						<Card.Text>Some room information goes here for the guest to read through</Card.Text>
					</div>
					<div className="flex-shrink-0 mt-3">
						<Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm">
							Book Now
						</Link>
					</div>
				</Card.Body>
			</Card>
		</Col>
	)
}

export default RoomCard
