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
import tfg.travel_with_me_a_p_i.model.DireccionDTO;
import tfg.travel_with_me_a_p_i.service.DireccionService;
import tfg.travel_with_me_a_p_i.util.ReferencedException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@RestController
@RequestMapping(value = "/api/direccions", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class DireccionResource {

    private final DireccionService direccionService;

    public DireccionResource(final DireccionService direccionService) {
        this.direccionService = direccionService;
    }

    @GetMapping
    public ResponseEntity<List<DireccionDTO>> getAllDireccions() {
        return ResponseEntity.ok(direccionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DireccionDTO> getDireccion(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(direccionService.get(id));
    }

    @PostMapping
    public ResponseEntity<Long> createDireccion(
            @RequestBody @Valid final DireccionDTO direccionDTO) {
        final Long createdId = direccionService.create(direccionDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateDireccion(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final DireccionDTO direccionDTO) {
        direccionService.update(id, direccionDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDireccion(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = direccionService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        direccionService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
