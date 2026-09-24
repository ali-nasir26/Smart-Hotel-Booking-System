import React, { useState } from "react";

const RoomFilter = ({ data, setFilteredData }) => {
	const [filter, setFilter] = useState("");

	const handleSelectChange = (e) => {
		const selectedType = e.target.value;
		setFilter(selectedType);

		// If the user selects the placeholder, show all rooms
		if (selectedType === "") {
			setFilteredData(data);
		} else {
			const filteredRooms = data.filter(
				(room) => room.roomType.toLowerCase() === selectedType.toLowerCase()
			);
			setFilteredData(filteredRooms);
		}
	};

	const clearFilter = () => {
		setFilter("");
		setFilteredData(data);
	};

	// This is the key line that correctly creates a unique list of room types
	const roomTypes = [...new Set(data.map((room) => room.roomType))];

	return (
		<div className="input-group mb-3">
			<span className="input-group-text" id="room-type-filter">
				Filter rooms by type
			</span>
			<select
				className="form-select"
				value={filter}
				onChange={handleSelectChange}>
				<option value="">select a room type to filter...</option>
				{roomTypes.map((type, index) => (
					<option key={index} value={type}>
						{type}
					</option>
				))}
			</select>
			<button className="btn btn-hotel" type="button" onClick={clearFilter}>
				Clear Filter
			</button>
		</div>
	);
};

export default RoomFilter;