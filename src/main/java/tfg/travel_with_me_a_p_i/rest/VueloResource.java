package tfg.travel_with_me_a_p_i.rest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tfg.travel_with_me_a_p_i.domain.Equipaje;
import tfg.travel_with_me_a_p_i.model.VueloDTO;
import tfg.travel_with_me_a_p_i.repos.EquipajeRepository;
import tfg.travel_with_me_a_p_i.service.VueloService;
import tfg.travel_with_me_a_p_i.util.CustomCollectors;
import tfg.travel_with_me_a_p_i.util.ReferencedException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@RestController
@RequestMapping(value = "/api/vuelos", produces = MediaType.APPLICATION_JSON_VALUE)
public class VueloResource {

    private final VueloService vueloService;
    private final EquipajeRepository equipajeRepository;

    public VueloResource(final VueloService vueloService,
            final EquipajeRepository equipajeRepository) {
        this.vueloService = vueloService;
        this.equipajeRepository = equipajeRepository;
    }

    @GetMapping("/filtrados")
    public ResponseEntity<List<VueloDTO>> getAllVuelosFiltrados(
        @RequestParam("origen") String origen,
        @RequestParam("destino") String destino,
        @RequestParam("fecha") String fecha) {

        return ResponseEntity.ok(vueloService.findAllFiltro(origen, destino, fecha));
    }

    @GetMapping
    public ResponseEntity<List<VueloDTO>> getAllVuelos() {
        return ResponseEntity.ok(vueloService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VueloDTO> getVuelo(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(vueloService.get(id));
    }

    @PostMapping
    public ResponseEntity<Long> createVuelo(@RequestBody @Valid final VueloDTO vueloDTO) {
        final Long createdId = vueloService.create(vueloDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateVuelo(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final VueloDTO vueloDTO) {
        vueloService.update(id, vueloDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVuelo(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = vueloService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        vueloService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/equipajeValues")
    public ResponseEntity<Map<Long, Long>> getEquipajeValues() {
        return ResponseEntity.ok(equipajeRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Equipaje::getId, Equipaje::getId)));
    }

}
