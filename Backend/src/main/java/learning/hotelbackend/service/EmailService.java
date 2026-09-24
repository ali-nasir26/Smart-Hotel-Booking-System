package learning.hotelbackend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    /**
     * Verified sender address in Brevo (or your provider). Do not use the smtp-brevo login here.
     * When empty, some providers still accept mail; Brevo usually requires this to be set and verified.
     */
    @Value("${spring.mail.from:}")
    private String mailFrom;

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    false,
                    StandardCharsets.UTF_8.name());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);
            if (StringUtils.hasText(mailFrom)) {
                helper.setFrom(mailFrom);
            }
            mailSender.send(mimeMessage);
            logger.info("Email sent successfully to {}", to);
        } catch (MailException ex) {
            logger.error("Email send failed for recipient {}", to, ex);
            throw ex;
        } catch (Exception ex) {
            logger.error("Email send failed for recipient {}", to, ex);
            throw new MailSendException("Failed to send email", ex);
        }
    }
}
