package tfg.travel_with_me_a_p_i.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TrayectoVueloDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String idTrayecto;

    @NotNull
    @Size(max = 255)
    private String aerolinea;

    @Size(max = 255)
    private String tipo;

    @NotNull
    private OffsetDateTime fechaSalida;

    @NotNull
    private OffsetDateTime fechaLlegada;

    @NotNull
    private Boolean escala;

   
    private OffsetDateTime fechaInicioEscala;

    
    private OffsetDateTime fechaFinEscala;

    @Size(max = 255)
    private String terminalSalida;

    @Size(max = 255)
    private String terminalLlegada;

    @NotNull
    private Long vuelo;

    @NotNull
    @TrayectoVueloOrigenUnique
    private Long origen;

    @NotNull
    private Long destino;

}
