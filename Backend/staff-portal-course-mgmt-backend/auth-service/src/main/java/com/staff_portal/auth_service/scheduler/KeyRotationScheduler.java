package com.staff_portal.auth_service.scheduler;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.staff_portal.auth_service.util.KeyUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicReference;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeyRotationScheduler {

    private final KeyUtil keyUtil;
    private final List<RSAKey> activeKeys = new CopyOnWriteArrayList<>();
    private final List<RSAKey> retiredKeys = new CopyOnWriteArrayList<>();
    private final AtomicReference<JWKSet> currentJWKSet = new AtomicReference<>();

    @PostConstruct
    public void initializeKeys(){
        try{
            KeyPair existingKeyPair = keyUtil.loadKeyPair();
            if (existingKeyPair != null){
                RSAKey rsaKey = keyUtil.generateRSAKey(existingKeyPair);
                activeKeys.add(rsaKey);
                log.info("Loaded existing key pair with key ID: {}", rsaKey.getKeyID());
            } else {
                rotateKeys();
            }
            updateJWKSet();
        } catch (Exception e) {
            log.error("Failed to initialize keys, generating new key pair ", e);
            rotateKeys();
        }
    }

    @Scheduled(fixedRate = 30 * 24 * 60 * 1000L)
    public void rotateKeys(){
        try {
            log.info("Starting key rotation process");
            if(!activeKeys.isEmpty()){
                retiredKeys.addAll(activeKeys);
                activeKeys.clear();
                log.info("Moved {} active keys to retired keys", retiredKeys.size());
            }

            KeyPair newKeyPair = keyUtil.generateKeyPair();
            keyUtil.saveKeyPair(newKeyPair);
            RSAKey newRSAKey = keyUtil.generateRSAKey(newKeyPair);
            activeKeys.add(newRSAKey);
            updateJWKSet();
            cleanupOldKeys();
            log.info("Key rotation completed successfully. New key ID: {}", newRSAKey.getKeyID());
        } catch (Exception e){
            log.error("Key rotation failed", e);
        }
    }

    @Scheduled(fixedRate = 24 * 60 * 60 * 1000L)
    public void cleanupOldKeys(){
        if (retiredKeys.size() > 5){
            int keysToRemove = retiredKeys.size() - 5;
            retiredKeys.subList(0, keysToRemove).clear();
            log.info("Cleaned up {} old retired keys", keysToRemove);
        }
    }

    public JWKSet getCurrentJWKSet(){
        return currentJWKSet.get();
    }

    public RSAKey getCurrentSigningKey(){
        return activeKeys.isEmpty() ? null : activeKeys.get(activeKeys.size() - 1);
    }

    public List<RSAKey> getAllValidationKeys(){
        List<RSAKey> allkeys = new ArrayList<>(activeKeys);
        allkeys.addAll(retiredKeys);
        return Collections.unmodifiableList(allkeys);
    }

    public void updateJWKSet(){
        List<RSAKey> allkeys = getAllValidationKeys();
        JWKSet newJWKSete = keyUtil.generateJWKSet(allkeys);
        currentJWKSet.set(newJWKSete);
        log.info("Updated JWK Set with {} keys ({} active, {} retired)", allkeys.size(), activeKeys.size(), retiredKeys.size());
    }
}
