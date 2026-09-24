package learning.hotelbackend.security.user;

import learning.hotelbackend.model.User;
import learning.hotelbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class HotelUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String normalized = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmailWithRoles(normalized)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + normalized));
        
        return HotelUserDetails.buildUserDetails(user);
    }
}