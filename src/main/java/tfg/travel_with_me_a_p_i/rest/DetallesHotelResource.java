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
import tfg.travel_with_me_a_p_i.model.DetallesHotelDTO;
import tfg.travel_with_me_a_p_i.service.DetallesHotelService;
import tfg.travel_with_me_a_p_i.util.ReferencedException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@RestController
@RequestMapping(value = "/api/detallesHotels", produces = MediaType.APPLICATION_JSON_VALUE)
public class DetallesHotelResource {

    private final DetallesHotelService detallesHotelService;

    public DetallesHotelResource(final DetallesHotelService detallesHotelService) {
        this.detallesHotelService = detallesHotelService;
    }

    @GetMapping
    public ResponseEntity<List<DetallesHotelDTO>> getAllDetallesHotels() {
        return ResponseEntity.ok(detallesHotelService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetallesHotelDTO> getDetallesHotel(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(detallesHotelService.get(id));
    }

    @PostMapping
    public ResponseEntity<Long> createDetallesHotel(
            @RequestBody @Valid final DetallesHotelDTO detallesHotelDTO) {
        final Long createdId = detallesHotelService.create(detallesHotelDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateDetallesHotel(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final DetallesHotelDTO detallesHotelDTO) {
        detallesHotelService.update(id, detallesHotelDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDetallesHotel(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = detallesHotelService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        detallesHotelService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
