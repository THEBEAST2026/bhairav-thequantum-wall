package space.whatsgoinon.bhairav.config;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.XMemcachedClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class MemcachedConfig {

    @Value("${memcached.servers}")
    private String servers;

    @Bean
    public MemcachedClient memcachedClient() throws IOException {
        XMemcachedClientBuilder builder = new XMemcachedClientBuilder(servers);
        return builder.build();
    }
}