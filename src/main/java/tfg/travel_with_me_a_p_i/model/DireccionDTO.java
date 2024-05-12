package tfg.travel_with_me_a_p_i.model;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DireccionDTO {

    private Long id;

    @NotNull
    @Size(max = 500)
    private String direccionString;

    @NotNull
    @Size(max = 255)
    private String direccion1;

    @Size(max = 255)
    private String direccion2;

    @NotNull
    @Size(max = 255)
    private String ciudad;

    @NotNull
    @Size(max = 255)
    private String pais;

    @NotNull
    @Size(max = 255)
    private String codPostal;

    @NotNull
    private Double latitud;

    @NotNull
    private Double longitud;

}
