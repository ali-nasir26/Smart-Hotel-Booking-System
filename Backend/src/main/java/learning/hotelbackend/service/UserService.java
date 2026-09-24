package learning.hotelbackend.service;

import learning.hotelbackend.exception.UserAlreadyExistsException;
import learning.hotelbackend.model.Role;
import learning.hotelbackend.model.User;
import learning.hotelbackend.request.RegisterRequest;
import learning.hotelbackend.repository.RoleRepository;
import learning.hotelbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    @Value("${app.frontend.url}")
    private String frontendUrl;
    @Value("${app.email-verification-token-expiry-minutes}")
    private long verificationTokenExpiryMinutes;
    @Value("${app.password-reset-token-expiry-minutes}")
    private long resetTokenExpiryMinutes;

    @Transactional
    @Override
    public User registerUser(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (email.isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException(email + " already exists");
        }
        User user = new User();
        user.setFirstName(request.getFirstName() != null ? request.getFirstName().trim() : null);
        user.setLastName(request.getLastName() != null ? request.getLastName().trim() : null);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(false);
        user.setVerificationToken(RandomStringUtils.randomAlphanumeric(64));
        user.setVerificationTokenExpiry(LocalDateTime.now().plusMinutes(verificationTokenExpiryMinutes));
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("ROLE_USER not found in the database."));
        user.setRoles(Collections.singletonList(userRole));
        User savedUser = userRepository.save(user);
        String encodedToken = URLEncoder.encode(savedUser.getVerificationToken(), StandardCharsets.UTF_8);
        String verificationUrl = normalizeFrontendBaseUrl(frontendUrl) + "/verify-email?token=" + encodedToken;
        emailService.sendEmail(
                savedUser.getEmail(),
                "Verify your account",
                "Welcome to The Elite Hotel.\n\nPlease verify your account using this link:\n"
                        + verificationUrl
                        + "\n\nThis link expires in " + verificationTokenExpiryMinutes + " minutes.");
        return savedUser;
    }

    @Override
    public void verifyUser(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));
        if (user.isEnabled()) {
            return;
        }
        if (user.getVerificationTokenExpiry() == null || user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification token has expired");
        }
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    @Override
    public void sendPasswordResetLink(String email) {
        String normalized = normalizeEmail(email);
        User user = userRepository.findByEmail(normalized)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + normalized));
        user.setResetToken(RandomStringUtils.randomAlphanumeric(64));
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(resetTokenExpiryMinutes));
        userRepository.save(user);
        String encodedToken = URLEncoder.encode(user.getResetToken(), StandardCharsets.UTF_8);
        String resetUrl = normalizeFrontendBaseUrl(frontendUrl) + "/reset-password?token=" + encodedToken;
        emailService.sendEmail(
                user.getEmail(),
                "Reset your password",
                "We received a request to reset your password.\n\nUse the link below:\n"
                        + resetUrl
                        + "\n\nThis link expires in " + resetTokenExpiryMinutes + " minutes.");
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional
    @Override
    public void deleteUser(String email) {
        String normalized = normalizeEmail(email);
        if (!userRepository.existsByEmail(normalized)) {
            throw new UsernameNotFoundException("User not found with email: " + normalized);
        }
        userRepository.deleteByEmail(normalized);
    }

    @Override
    public User getUser(String email) {
        String normalized = normalizeEmail(email);
        return userRepository.findByEmail(normalized)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + normalized));
    }

    private static String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String normalizeFrontendBaseUrl(String url) {
        if (url == null) {
            return "";
        }
        String base = url.trim();
        while (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base;
    }
}