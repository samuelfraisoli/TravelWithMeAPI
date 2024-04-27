package tfg.travel_with_me_a_p_i.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class VueloDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String idVuelo;

    @NotNull
    @Size(max = 255)
    private String aerolinea;

    @NotNull
    private Double precio;

    @Size(max = 255)
    private String tipo;

    @NotNull
    @Size(max = 255)
    private String origen;

    @NotNull
    @Size(max = 255)
    private String destino;

    @NotNull
    private OffsetDateTime fecha;

    private Long equipaje;

}
