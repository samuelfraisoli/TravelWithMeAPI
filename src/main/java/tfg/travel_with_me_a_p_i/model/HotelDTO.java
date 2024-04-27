package tfg.travel_with_me_a_p_i.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class HotelDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String nombre;

    @NotNull
    private List<@Size(max = 255) String> fotos;

    private List<@Size(max = 255) String> fechasLibres;

    @NotNull
    @HotelDireccionUnique
    private Long direccion;

    @NotNull
    @HotelDetallesHotelUnique
    private Long detallesHotel;

}
