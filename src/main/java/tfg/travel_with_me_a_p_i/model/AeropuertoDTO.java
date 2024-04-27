package tfg.travel_with_me_a_p_i.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AeropuertoDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String nombre;

    @NotNull
    @Size(max = 255)
    private String ciudad;

    @NotNull
    @Size(max = 255)
    private String ciudadAbrev;

    @NotNull
    @Size(max = 255)
    private String pais;

}
