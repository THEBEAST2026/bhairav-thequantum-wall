package space.whatsgoinon.bhairav.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import space.whatsgoinon.bhairav.entity.Encrypt;

public interface EncryptedRecordRepository
        extends JpaRepository<Encrypt, String> { }
