package space.whatsgoinon.bhairav.service;

import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class QuantumEntropyService {

    private static final String ANU_URL =
            "https://qrng.anu.edu.au/API/jsonI.php";

    public byte[] getQuantumBytes(int numBytes) throws IOException, InterruptedException {
        String url = ANU_URL + "?length=" + numBytes + "&type=uint8";
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(10))
                .GET().build();

        HttpResponse<String> resp = client.send(
                req, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(resp.body());

        if (!root.get("success").asBoolean())
            throw new RuntimeException("QRNG returned failure");

        JsonNode data = root.get("data");
        byte[] result = new byte[numBytes];
        for (int i = 0; i < numBytes; i++)
            result[i] = (byte) data.get(i).asInt();
        return result;
    }
}
