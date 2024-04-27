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
import tfg.travel_with_me_a_p_i.model.AeropuertoDTO;
import tfg.travel_with_me_a_p_i.service.AeropuertoService;
import tfg.travel_with_me_a_p_i.util.ReferencedException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@RestController
@RequestMapping(value = "/api/aeropuertos", produces = MediaType.APPLICATION_JSON_VALUE)
public class AeropuertoResource {

    private final AeropuertoService aeropuertoService;

    public AeropuertoResource(final AeropuertoService aeropuertoService) {
        this.aeropuertoService = aeropuertoService;
    }

    @GetMapping
    public ResponseEntity<List<AeropuertoDTO>> getAllAeropuertos() {
        return ResponseEntity.ok(aeropuertoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AeropuertoDTO> getAeropuerto(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(aeropuertoService.get(id));
    }

    @PostMapping
    public ResponseEntity<Long> createAeropuerto(
            @RequestBody @Valid final AeropuertoDTO aeropuertoDTO) {
        final Long createdId = aeropuertoService.create(aeropuertoDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateAeropuerto(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final AeropuertoDTO aeropuertoDTO) {
        aeropuertoService.update(id, aeropuertoDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAeropuerto(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = aeropuertoService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        aeropuertoService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
