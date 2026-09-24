import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

/** Raw Base64 from API → data URL (no spaces; JPEG is typical for uploads). */
export function roomPhotoDataUrl(photo) {
    if (photo == null || String(photo).trim() === "") {
        return null;
    }
    const cleaned = String(photo).replace(/\s+/g, "");
    return `data:image/jpeg;base64,${cleaned}`;
}

export const ROOM_IMAGE_PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect fill="#e9ecef" width="640" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#adb5bd" font-family="system-ui,sans-serif" font-size="16">No photo</text></svg>'
    );

function parseApiErrorMessage(error, fallback) {
    const data = error.response?.data;
    if (data == null) return fallback;
    if (typeof data === "string") return data;
    if (typeof data === "object" && data.message != null) return String(data.message);
    return fallback;
}

export const getHeader = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

/* This function adds a new room to the database */
export async function addRoom(photo, roomType, roomPrice) {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("roomType", roomType);
    formData.append("roomPrice", roomPrice);

    const response = await api.post("/rooms/add/new-room", formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
}

/* This function gets all room types from the database */
export async function getRoomTypes() {
    try {
        const response = await api.get("/rooms/room/types");
        return response.data;
    } catch (error) {
        throw new Error("Error fetching room types");
    }
}

/* This function gets all rooms from the database */
export async function getAllRooms() {
    try {
        const result = await api.get("/rooms/all-rooms");
        return result.data;
    } catch (error) {
        throw new Error(parseApiErrorMessage(error, "Error fetching rooms"));
    }
}

/* This function deletes a room by its Id */
export async function deleteRoom(roomId) {
    try {
        const result = await api.delete(`/rooms/delete/room/${roomId}`, {
            headers: getHeader(),
        });
        return result.data;
    } catch (error) {
        throw new Error(`Error deleting room: ${error.message}`);
    }
}

/* This function updates a room */
export async function updateRoom(roomId, roomData) {
    const formData = new FormData();
    formData.append("roomType", roomData.roomType);
    formData.append("roomPrice", roomData.roomPrice);
    if (roomData.photo) {
        formData.append("photo", roomData.photo);
    }

    const response = await api.put(`/rooms/update/${roomId}`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
}

/* This function gets a room by its id */
export async function getRoomById(roomId) {
    try {
        const result = await api.get(`/rooms/room/${roomId}`);
        return result.data;
    } catch (error) {
        throw new Error(parseApiErrorMessage(error, `Error fetching room: ${error.message}`));
    }
}

/* This function saves a new booking to the database */
export async function bookRoom(roomId, booking) {
    try {
        // THIS IS THE CORRECTED PART
        const response = await api.post(`/bookings/room/${roomId}/booking`, booking, {
            headers: getHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || `Error booking room: ${error.message}`);
    }
}

/* This function gets all bookings from the database */
export async function getAllBookings() {
    try {
        const result = await api.get("/bookings/all-bookings", {
            headers: getHeader(),
        });
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching bookings: ${error.message}`);
    }
}

/* This function gets a booking by its confirmation code */
export async function getBookingByConfirmationCode(confirmationCode) {
    try {
        const result = await api.get(`/bookings/confirmation/${confirmationCode}`);
        return result.data;
    } catch (error) {
        throw new Error(error.response?.data || `Error finding booking: ${error.message}`);
    }
}

/* This function cancels a booking */
export async function cancelBooking(bookingId) {
    try {
        const result = await api.delete(`/bookings/booking/${bookingId}/delete`, {
            headers: getHeader(),
        });
        return result.data;
    } catch (error) {
        const msg = parseApiErrorMessage(error, `Error cancelling booking: ${error.message}`);
        throw new Error(msg);
    }
}

/* This function gets all available rooms from the database with a given date and a room type */
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
    try {
        const result = await api.get(
            `/rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
        );
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching available rooms: ${error.message}`);
    }
}

/* This function registers a new user */
export async function registerUser(registration) {
    try {
        const response = await api.post("/auth/register-user", registration);
        return response.data;
    } catch (error) {
        const msg = parseApiErrorMessage(error, `User registration error: ${error.message}`);
        throw new Error(msg);
    }
}

/* This function logs in a registered user */
export async function loginUser(login) {
    try {
        const response = await api.post("/auth/login", login);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Invalid email or password.");
    }
}

export async function verifyEmail(token) {
    try {
        const response = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Email verification failed.");
    }
}

export async function forgotPassword(email) {
    try {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Unable to send reset link.");
    }
}

export async function resetPassword(token, newPassword) {
    try {
        const response = await api.post("/auth/reset-password", { token, newPassword });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Unable to reset password.");
    }
}

/* This function gets a single user by id */
export async function getUser(userId, token) {
    try {
        const response = await api.get(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
}

/* This function deletes a user by id */
export async function deleteUser(userId) {
    try {
        const response = await api.delete(`/users/delete/${userId}`, {
            headers: getHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
}

/* This function gets user bookings by the user id */
export async function getBookingsByUserId(userId, token) {
    try {
        const response = await api.get(`/bookings/user/${userId}/bookings`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching bookings: ${error.message}`);
    }
}