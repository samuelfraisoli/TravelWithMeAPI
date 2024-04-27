package tfg.travel_with_me_a_p_i.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class EquipajeDTO {

    private Long id;

    @Size(max = 255)
    private String peso;

    @Size(max = 255)
    private String alto;

    @Size(max = 255)
    private String ancho;

    @Size(max = 255)
    private String precio;

}
