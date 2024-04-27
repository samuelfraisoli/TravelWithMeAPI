package tfg.travel_with_me_a_p_i.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tfg.travel_with_me_a_p_i.domain.Aeropuerto;
import tfg.travel_with_me_a_p_i.domain.TrayectoVuelo;
import tfg.travel_with_me_a_p_i.domain.Vuelo;

import java.util.List;


public interface TrayectoVueloRepository extends JpaRepository<TrayectoVuelo, Long> {

    TrayectoVuelo findFirstByVuelo(Vuelo vuelo);

    TrayectoVuelo findFirstByOrigen(Aeropuerto aeropuerto);

    TrayectoVuelo findFirstByDestino(Aeropuerto aeropuerto);

    boolean existsByOrigenId(Long id);

    @Query("SELECT tv FROM TrayectoVuelo tv WHERE tv.vuelo.id = :idVuelo")
    List<TrayectoVuelo> findAllFiltroIdVuelo(Long idVuelo);

}
