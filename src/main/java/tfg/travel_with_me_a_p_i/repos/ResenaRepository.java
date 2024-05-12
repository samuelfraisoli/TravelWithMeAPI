package tfg.travel_with_me_a_p_i.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tfg.travel_with_me_a_p_i.domain.Hotel;
import tfg.travel_with_me_a_p_i.domain.Resena;
import tfg.travel_with_me_a_p_i.domain.TrayectoVuelo;

import java.util.List;


public interface ResenaRepository extends JpaRepository<Resena, Long> {

    Resena findFirstByHotel(Hotel hotel);

    @Query("SELECT r FROM Resena r WHERE r.hotel.id = :idHotel")
    List<Resena> findAllFiltroHotelId(Long idHotel);

}
