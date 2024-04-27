package tfg.travel_with_me_a_p_i.rest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tfg.travel_with_me_a_p_i.domain.Aeropuerto;
import tfg.travel_with_me_a_p_i.domain.Vuelo;
import tfg.travel_with_me_a_p_i.model.TrayectoVueloDTO;
import tfg.travel_with_me_a_p_i.repos.AeropuertoRepository;
import tfg.travel_with_me_a_p_i.repos.VueloRepository;
import tfg.travel_with_me_a_p_i.service.TrayectoVueloService;
import tfg.travel_with_me_a_p_i.util.CustomCollectors;


@RestController
@RequestMapping(value = "/api/trayectoVuelos", produces = MediaType.APPLICATION_JSON_VALUE)
public class TrayectoVueloResource {

    private final TrayectoVueloService trayectoVueloService;
    private final VueloRepository vueloRepository;
    private final AeropuertoRepository aeropuertoRepository;

    public TrayectoVueloResource(final TrayectoVueloService trayectoVueloService,
            final VueloRepository vueloRepository,
            final AeropuertoRepository aeropuertoRepository) {
        this.trayectoVueloService = trayectoVueloService;
        this.vueloRepository = vueloRepository;
        this.aeropuertoRepository = aeropuertoRepository;
    }

    @GetMapping("/filtradosIdVuelo")
    public ResponseEntity<List<TrayectoVueloDTO>> getAllTrayectoVuelosFiltroVueloId(
        @RequestParam("idVuelo") String idVuelo
    ) {
        long idVueloLong = Long.parseLong(idVuelo);
        return ResponseEntity.ok(trayectoVueloService.findAllFiltroVueloId(idVueloLong));
    }

    @GetMapping
    public ResponseEntity<List<TrayectoVueloDTO>> getAllTrayectoVuelos() {
        return ResponseEntity.ok(trayectoVueloService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrayectoVueloDTO> getTrayectoVuelo(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(trayectoVueloService.get(id));
    }

    @PostMapping
    public ResponseEntity<Long> createTrayectoVuelo(
            @RequestBody @Valid final TrayectoVueloDTO trayectoVueloDTO) {
        final Long createdId = trayectoVueloService.create(trayectoVueloDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateTrayectoVuelo(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final TrayectoVueloDTO trayectoVueloDTO) {
        trayectoVueloService.update(id, trayectoVueloDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrayectoVuelo(@PathVariable(name = "id") final Long id) {
        trayectoVueloService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/vueloValues")
    public ResponseEntity<Map<Long, String>> getVueloValues() {
        return ResponseEntity.ok(vueloRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Vuelo::getId, Vuelo::getIdVuelo)));
    }

    @GetMapping("/origenValues")
    public ResponseEntity<Map<Long, String>> getOrigenValues() {
        return ResponseEntity.ok(aeropuertoRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Aeropuerto::getId, Aeropuerto::getNombre)));
    }

    @GetMapping("/destinoValues")
    public ResponseEntity<Map<Long, String>> getDestinoValues() {
        return ResponseEntity.ok(aeropuertoRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Aeropuerto::getId, Aeropuerto::getNombre)));
    }

}
