package com.staff_portal.auth_service.util;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.*;

@Component
@Slf4j
public class KeyUtil {
    private static final String ALGORITHM = "RSA";
    private final String keyDirectory;
    private final int KEY_SIZE;

    public KeyUtil(@Value("${auth-service.keys.path}") String keyDirectory,
                   @Value("${auth-service.jwt.rsa-key-size}") int keySize) {
        this.keyDirectory = keyDirectory;
        this.KEY_SIZE = keySize;
        createKeyDirectoryIfNotExists(); // Now keyDirectory has the proper value
    }

    public KeyPair generateKeyPair() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(ALGORITHM);
            keyPairGenerator.initialize(KEY_SIZE);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();
            log.info("Generated new {} key pair with size: {}", ALGORITHM, KEY_SIZE);
            return keyPair;
        } catch (NoSuchAlgorithmException e) {
            log.error("Failed to generate {} key pair with size: {}", ALGORITHM, KEY_SIZE, e);
            throw new IllegalStateException("Failed to generate key pair for algorithm: " + ALGORITHM, e);
        } catch (InvalidParameterException e) {
            log.error("Invalid key size: {}", KEY_SIZE, e);
            throw new IllegalArgumentException("Invalid key size: " + KEY_SIZE, e);
        }
    }

    public void saveKeyPair(KeyPair keyPair) {
        if (keyPair == null || keyPair.getPrivate() == null || keyPair.getPublic() == null) {
            log.error("Cannot save null key pair or missing keys");
            throw new IllegalArgumentException("Key pair or its components cannot be null");
        }
        try {
            savePrivateKey(keyPair.getPrivate());
            savePublicKey(keyPair.getPublic());
            log.info("Key pair saved successfully to directory: {}", keyDirectory);
        } catch (IOException e) {
            log.error("Failed to save key pair to directory: {}", keyDirectory, e);
            throw new IllegalStateException("Failed to save key pair to: " + keyDirectory, e);
        }
    }

    public KeyPair loadKeyPair() {
        try {
            PrivateKey privateKey = loadPrivateKey();
            PublicKey publicKey = loadPublicKey();
            if (privateKey == null || publicKey == null) {
                log.warn("Missing private or public key in directory: {}, generating new key pair", keyDirectory);
                return null;
            }
            log.debug("Loaded key pair from directory: {}", keyDirectory);
            return new KeyPair(publicKey, privateKey);
        } catch (Exception e) {
            log.warn("Failed to load key pair from directory: {}, generating new one", keyDirectory, e);
            return null;
        }
    }

    public RSAKey generateRSAKey(KeyPair keyPair) {
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
        return new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(generateKeyId())
                .algorithm(JWSAlgorithm.RS256)
                .keyUse(KeyUse.SIGNATURE)
                .build();
    }

    public JWKSet generateJWKSet(List<RSAKey> keys) {
        return new JWKSet(new ArrayList<>(keys));
    }

    private void savePrivateKey(PrivateKey privateKey) throws IOException {
        String privateKeyPEM = convertToPEM(privateKey, "PRIVATE KEY");
        Files.write(Paths.get(keyDirectory, "private-key.pem"), privateKeyPEM.getBytes());
        setFilePermissions(Paths.get(keyDirectory, "private-key.pem"));
    }

    private void savePublicKey(PublicKey publicKey) throws IOException {
        String publicKeyPEM = convertToPEM(publicKey, "PUBLIC KEY");
        Files.write(Paths.get(keyDirectory, "public-key.pem"), publicKeyPEM.getBytes());
    }

    private PrivateKey loadPrivateKey() throws Exception {
        String privateKeyPEM = Files.readString(Paths.get(keyDirectory, "private-key.pem"));
        return parsePrivateKey(privateKeyPEM);
    }

    private PublicKey loadPublicKey() throws Exception {
        String publicKeyPEM = Files.readString(Paths.get(keyDirectory, "public-key.pem"));
        return parsePublicKey(publicKeyPEM);
    }

    private String convertToPEM(Key key, String keyType) {
        byte[] encoded = key.getEncoded();
        String base64Encoded = Base64.getEncoder().encodeToString(encoded).toString();
        return String.format("-----BEGIN %s-----\n%s\n-----END %s-----\n",
                keyType, formatBase64(base64Encoded), keyType);
    }

    private String formatBase64(String base64) {
        return base64.replaceAll("(.{64})", "$1\n");
    }

    private PrivateKey parsePrivateKey(String privateKeyPEM) throws Exception {
        String privateKeyContent = privateKeyPEM
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(privateKeyContent);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
        KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);
        return keyFactory.generatePrivate(keySpec);
    }

    private PublicKey parsePublicKey(String publicKeyPEM) throws Exception {
        String publicKeyContent = publicKeyPEM
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(publicKeyContent);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);
        KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);
        return keyFactory.generatePublic(keySpec);
    }

    private String generateKeyId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    private void createKeyDirectoryIfNotExists() {
        if (keyDirectory == null || keyDirectory.trim().isEmpty()) {
            log.error("Key directory can't be null or empty");
            throw new IllegalArgumentException("Key directory path cannot be null or empty");
        }
        try {
            Path keyPath = Paths.get(keyDirectory);
            if (Files.exists(keyPath)) {
                log.debug("Key directory already exists: {}", keyPath);
                return;
            }
            Files.createDirectories(keyPath);
            log.info("Created key directory: {}", keyPath);
        } catch (IOException e) {
            log.error("Failed to create key directory: {}", keyDirectory, e);
            throw new IllegalStateException("Unable to create key directory: " + keyDirectory, e);
        }
    }

    private void setFilePermissions(Path filePath) {
        try {
            Files.setPosixFilePermissions(filePath,
                    EnumSet.of(PosixFilePermission.OWNER_READ, PosixFilePermission.OWNER_WRITE));
        } catch (IOException | UnsupportedOperationException e) {
            log.warn("Could not set file permissions for: {}", filePath);
        }
    }
}
