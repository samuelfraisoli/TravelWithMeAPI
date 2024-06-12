package tfg.travel_with_me_a_p_i.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ResenaDTO {

    private Long id;

    @Size(max = 255)
    private String idUsuario;

    @NotNull
    private OffsetDateTime fecha;

    @Size(max = 255)
    private String titulo;

    @NotNull
    @Size(max = 2000)
    private String contenido;

    private Float nota;

    private Long hotel;

}
