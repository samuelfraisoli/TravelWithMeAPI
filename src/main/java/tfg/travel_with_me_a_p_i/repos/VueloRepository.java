package tfg.travel_with_me_a_p_i.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tfg.travel_with_me_a_p_i.domain.Equipaje;
import tfg.travel_with_me_a_p_i.domain.Vuelo;

import java.sql.Date;
import java.util.List;


public interface VueloRepository extends JpaRepository<Vuelo, Long> {


    Vuelo findFirstByEquipaje(Equipaje equipaje);

    @Query("SELECT v FROM Vuelo v WHERE v.origen LIKE %:origen% AND v.destino LIKE %:destino% AND DATE(v.fecha) = :fecha")
    List<Vuelo> findAllFiltro(String origen, String destino, Date fecha);

}
