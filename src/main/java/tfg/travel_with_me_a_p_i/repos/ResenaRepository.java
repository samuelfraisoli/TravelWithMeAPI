package tfg.travel_with_me_a_p_i.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import tfg.travel_with_me_a_p_i.domain.Hotel;
import tfg.travel_with_me_a_p_i.domain.Resena;


public interface ResenaRepository extends JpaRepository<Resena, Long> {

    Resena findFirstByHotel(Hotel hotel);

}
