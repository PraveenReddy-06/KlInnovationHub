package com.klu.security;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Locale;
import java.util.OptionalLong;
import java.util.regex.Pattern;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AdminTotp {

    private static final String BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    private static final Pattern SIX_DIGITS = Pattern.compile("[0-9]{6}");
    private static final int STEP_SECONDS = 30;

    private final String email;
    private final byte[] secret;

    public AdminTotp(@Value("${admin.mfa.email:}") String email,
            @Value("${admin.mfa.totp-secret:}") String base32Secret) {
        this.email = email.strip();
        this.secret = decodeBase32(base32Secret);
    }

    public OptionalLong verify(String accountEmail, String code, Long lastUsedStep) {
        if (secret.length < 20 || !email.equalsIgnoreCase(accountEmail) || code == null
                || !SIX_DIGITS.matcher(code).matches()) {
            return OptionalLong.empty();
        }
        return match(secret, code, Instant.now(), lastUsedStep);
    }

    static OptionalLong match(byte[] secret, String code, Instant now, Long lastUsedStep) {
        long step = Math.floorDiv(now.getEpochSecond(), STEP_SECONDS);
        for (long candidate = step - 1; candidate <= step + 1; candidate++) {
            if ((lastUsedStep == null || candidate > lastUsedStep)
                    && MessageDigest.isEqual(code.getBytes(StandardCharsets.US_ASCII), codeAt(secret, candidate))) {
                return OptionalLong.of(candidate);
            }
        }
        return OptionalLong.empty();
    }

    static byte[] codeAt(byte[] secret, long step) {
        try {
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(new SecretKeySpec(secret, "HmacSHA1"));
            byte[] digest = mac.doFinal(ByteBuffer.allocate(Long.BYTES).putLong(step).array());
            int offset = digest[digest.length - 1] & 0xf;
            int value = ByteBuffer.wrap(digest, offset, Integer.BYTES).getInt() & Integer.MAX_VALUE;
            return String.format(Locale.ROOT, "%06d", value % 1_000_000).getBytes(StandardCharsets.US_ASCII);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("TOTP validation unavailable", e);
        }
    }

    private static byte[] decodeBase32(String encoded) {
        String normalized = encoded.strip().replace(" ", "").toUpperCase(Locale.ROOT);
        if (!normalized.matches("[A-Z2-7]{32,104}")) {
            return new byte[0];
        }
        byte[] result = new byte[normalized.length() * 5 / 8];
        int buffer = 0;
        int bits = 0;
        int index = 0;
        for (int i = 0; i < normalized.length(); i++) {
            buffer = (buffer << 5) | BASE32.indexOf(normalized.charAt(i));
            bits += 5;
            if (bits >= 8) {
                bits -= 8;
                result[index++] = (byte) (buffer >> bits);
            }
        }
        return result;
    }
}
