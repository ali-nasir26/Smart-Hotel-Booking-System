package learning.hotelbackend.service;
import java.util.List;
import learning.hotelbackend.exception.InvalidBookingRequestException;
import learning.hotelbackend.exception.ResourceNotFoundException;
import learning.hotelbackend.model.BookedRoom;
import learning.hotelbackend.model.Room;
import learning.hotelbackend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {
    private final BookingRepository bookingRepository;
    private final IRoomService roomService;
    private final EmailService emailService;

    @Override
    public List<BookedRoom> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<BookedRoom> getBookingsByUserEmail(String email) {
        return bookingRepository.findByGuestEmail(email);
    }

    @Override
    public void cancelBooking(Long bookingId, String actingUserEmail, boolean isAdmin) {
        BookedRoom booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        String guestEmail = booking.getGuestEmail();
        if (!isAdmin && (guestEmail == null || !guestEmail.equalsIgnoreCase(actingUserEmail))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only cancel your own bookings.");
        }
        bookingRepository.deleteById(bookingId);
    }

    @Override
    public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    @Override
    public String saveBooking(Long roomId, BookedRoom bookingRequest) {
        if (bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
            throw new InvalidBookingRequestException("Check-in date must come before check-out date");
        }

        // 2. Safely get the room or throw a specific exception
        Room room = roomService.getRoomById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        List<BookedRoom> existingBookings = room.getBookings();
        boolean roomIsAvailable = roomIsAvailable(bookingRequest, existingBookings);

        if (roomIsAvailable) {
            // 3. Move business logic here: generate confirmation code
            String confirmationCode = RandomStringUtils.randomNumeric(10);
            bookingRequest.setBookingConfirmationCode(confirmationCode);
            room.addBooking(bookingRequest); // This now only syncs the relationship
            bookingRepository.save(bookingRequest);
            sendBookingConfirmationEmail(bookingRequest, room);
        } else {
            throw new InvalidBookingRequestException("Sorry, this room is not available for the selected dates.");
        }
        return bookingRequest.getBookingConfirmationCode();
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
        return bookingRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("No booking found with booking code: " + confirmationCode));
    }

    // 1. CRITICAL FIX: Replaced with the standard, correct algorithm for checking date overlaps.
    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        // Check if new booking's check-in is before existing's check-out
                        bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()) &&
                                // AND check if new booking's check-out is after existing's check-in
                                bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckInDate())
                );
    }

    private void sendBookingConfirmationEmail(BookedRoom booking, Room room) {
        if (booking.getGuestEmail() == null || booking.getGuestEmail().isBlank()) {
            return;
        }
        String body = "Your booking has been confirmed.\n\n"
                + "Hotel: The Elite Hotel\n"
                + "Room Type: " + room.getRoomType() + "\n"
                + "Check-in: " + booking.getCheckInDate() + "\n"
                + "Check-out: " + booking.getCheckOutDate() + "\n"
                + "Price per night: " + room.getRoomPrice() + "\n"
                + "Guest Name: " + booking.getGuestFullName() + "\n"
                + "Guest Email: " + booking.getGuestEmail() + "\n"
                + "Booking Code: " + booking.getBookingConfirmationCode() + "\n";
        emailService.sendEmail(booking.getGuestEmail(), "Booking Confirmation - The Elite Hotel", body);
    }
}