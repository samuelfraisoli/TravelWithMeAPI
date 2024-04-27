package tfg.travel_with_me_a_p_i.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import tfg.travel_with_me_a_p_i.domain.DetallesHotel;
import tfg.travel_with_me_a_p_i.domain.Direccion;
import tfg.travel_with_me_a_p_i.domain.Hotel;


public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Hotel findFirstByDireccion(Direccion direccion);

    Hotel findFirstByDetallesHotel(DetallesHotel detallesHotel);

    boolean existsByDireccionId(Long id);

    boolean existsByDetallesHotelId(Long id);

}
