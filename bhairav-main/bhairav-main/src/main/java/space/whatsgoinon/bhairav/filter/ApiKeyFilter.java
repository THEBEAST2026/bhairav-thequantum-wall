package space.whatsgoinon.bhairav.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import space.whatsgoinon.bhairav.service.NonceService;

import java.io.IOException;
import java.util.Set;


@Component
@Order(1)
public class ApiKeyFilter implements Filter {

    @Value("${quantum-wall.api-key}") String apiKey;
    @Autowired
    NonceService nonceService;

    private static final Set<String> PROTECTED =
            Set.of("/encrypt", "/decrypt", "/handshake");

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest  hReq = (HttpServletRequest)  req;
        HttpServletResponse hRes = (HttpServletResponse) res;

        String path = hReq.getRequestURI();
        boolean isProtected = PROTECTED.stream().anyMatch(path::startsWith);

        if (isProtected) {
            // 1. API key check
            String reqKey = hReq.getHeader("X-API-Key");
            if (!apiKey.equals(reqKey)) {
                hRes.sendError(401, "Unauthorized"); return;
            }

            // 2. Nonce + timestamp check (MITM detection)
            String nonce = hReq.getHeader("X-Nonce");
            String ts    = hReq.getHeader("X-Timestamp");
            if (nonce == null || ts == null ||
                    !nonceService.validateAndConsume(nonce, ts)) {
                hRes.setContentType("application/json");
                hRes.setStatus(403);
                hRes.getWriter().write("{\"detail\":\"Nonce reuse or stale timestamp\"," +
                        "\"threat\":true,\"type\":\"REPLAY_ATTACK\"}");
                return;
            }
        }
        chain.doFilter(req, res);
    }
}

