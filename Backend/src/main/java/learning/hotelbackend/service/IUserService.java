package learning.hotelbackend.service;

import learning.hotelbackend.model.User;

import learning.hotelbackend.request.RegisterRequest;

import java.util.List;

public interface IUserService {
    User registerUser(RegisterRequest request);
    void verifyUser(String token);
    void sendPasswordResetLink(String email);
    void resetPassword(String token, String newPassword);
    List<User> getUsers();
    void deleteUser(String email);
    User getUser(String email);
}
