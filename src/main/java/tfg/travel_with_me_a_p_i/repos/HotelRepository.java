package tfg.travel_with_me_a_p_i.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tfg.travel_with_me_a_p_i.domain.DetallesHotel;
import tfg.travel_with_me_a_p_i.domain.Direccion;
import tfg.travel_with_me_a_p_i.domain.Hotel;
import tfg.travel_with_me_a_p_i.domain.Vuelo;

import java.sql.Date;
import java.util.List;


public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Hotel findFirstByDireccion(Direccion direccion);

    Hotel findFirstByDetallesHotel(DetallesHotel detallesHotel);

    boolean existsByDireccionId(Long id);

    boolean existsByDetallesHotelId(Long id);

    @Query("SELECT h FROM Hotel h JOIN h.direccion d WHERE h.nombre LIKE %:nombre% OR d.ciudad LIKE %:nombre% OR d.pais LIKE %:nombre%")
    List<Hotel> findAllFiltro(String nombre);
}
