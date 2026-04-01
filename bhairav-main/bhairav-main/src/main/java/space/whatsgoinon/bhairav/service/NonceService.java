package space.whatsgoinon.bhairav.service;

import net.rubyeye.xmemcached.MemcachedClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NonceService {

    @Autowired
    MemcachedClient memcached;
    @Value("${quantum-wall.nonce-window-seconds:30}") int windowSecs;

    /**
     * Returns true if nonce is valid (unseen + timestamp fresh).
     * Stores nonce in Memcached with TTL = windowSecs.
     */
    public boolean validateAndConsume(String nonce, String timestampStr) {
        long ts = Long.parseLong(timestampStr);
        long now = System.currentTimeMillis() / 1000;
        if (Math.abs(now - ts) > windowSecs) return false; // stale

        String key = "nonce:" + nonce;
        try {
            // set only if absent (CAS-style) — nonce TTL = window * 2
            boolean added = memcached.add(key, windowSecs * 2, "1");
            return added; // false = nonce already seen = replay attack
        } catch (Exception e) { return false; }
    }
}
