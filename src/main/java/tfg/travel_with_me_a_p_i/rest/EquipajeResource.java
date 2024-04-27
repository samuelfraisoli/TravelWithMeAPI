package tfg.travel_with_me_a_p_i.rest;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tfg.travel_with_me_a_p_i.model.EquipajeDTO;
import tfg.travel_with_me_a_p_i.service.EquipajeService;
import tfg.travel_with_me_a_p_i.util.ReferencedException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@RestController
@RequestMapping(value = "/api/equipajes", produces = MediaType.APPLICATION_JSON_VALUE)
public class EquipajeResource {

    private final EquipajeService equipajeService;

    public EquipajeResource(final EquipajeService equipajeService) {
        this.equipajeService = equipajeService;
    }

    @GetMapping
    public ResponseEntity<List<EquipajeDTO>> getAllEquipajes() {
        return ResponseEntity.ok(equipajeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipajeDTO> getEquipaje(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(equipajeService.get(id));
    }

    @PostMapping
    public ResponseEntity<Long> createEquipaje(@RequestBody @Valid final EquipajeDTO equipajeDTO) {
        final Long createdId = equipajeService.create(equipajeDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateEquipaje(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final EquipajeDTO equipajeDTO) {
        equipajeService.update(id, equipajeDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipaje(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = equipajeService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        equipajeService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
