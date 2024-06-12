package tfg.travel_with_me_a_p_i.model;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DetallesHotelDTO {

    private Long id;

    @Size(max = 2000)
    private String descripcion;

    @Size(max = 255)
    private String web;

    @Size(max = 255)
    private String telefono;

    private List<@Size(max = 255) String> comodidades;

    private double precio;

}
