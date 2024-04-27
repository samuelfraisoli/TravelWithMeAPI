package tfg.travel_with_me_a_p_i.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import tfg.travel_with_me_a_p_i.domain.Direccion;


public interface DireccionRepository extends JpaRepository<Direccion, Long> {
}
