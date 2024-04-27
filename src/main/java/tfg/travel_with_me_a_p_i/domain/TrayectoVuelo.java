package tfg.travel_with_me_a_p_i.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class TrayectoVuelo {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String idTrayecto;

    @Column(nullable = false)
    private String aerolinea;

    @Column
    private String tipo;

    @Column(nullable = false)
    private OffsetDateTime fechaSalida;

    @Column(nullable = false)
    private OffsetDateTime fechaLlegada;

    @Column(nullable = false)
    private Boolean escala;

    @Column(nullable = false)
    private OffsetDateTime fechaInicioEscala;

    @Column(nullable = false)
    private OffsetDateTime fechaFinEscala;

    @Column
    private String terminalSalida;

    @Column
    private String terminalLlegada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vuelo_id", nullable = false)
    private Vuelo vuelo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origen_id", nullable = false, unique = true)
    private Aeropuerto origen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destino_id", nullable = false)
    private Aeropuerto destino;

}
