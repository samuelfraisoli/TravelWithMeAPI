package tfg.travel_with_me_a_p_i.rest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tfg.travel_with_me_a_p_i.domain.Hotel;
import tfg.travel_with_me_a_p_i.model.ResenaDTO;
import tfg.travel_with_me_a_p_i.model.TrayectoVueloDTO;
import tfg.travel_with_me_a_p_i.repos.HotelRepository;
import tfg.travel_with_me_a_p_i.service.ResenaService;
import tfg.travel_with_me_a_p_i.util.CustomCollectors;


@RestController
@RequestMapping(value = "/api/resenas", produces = MediaType.APPLICATION_JSON_VALUE)
public class ResenaResource {

    private final ResenaService resenaService;
    private final HotelRepository hotelRepository;

    public ResenaResource(final ResenaService resenaService,
            final HotelRepository hotelRepository) {
        this.resenaService = resenaService;
        this.hotelRepository = hotelRepository;
    }

    @GetMapping
    public ResponseEntity<List<ResenaDTO>> getAllResenas() {
        return ResponseEntity.ok(resenaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResenaDTO> getResena(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(resenaService.get(id));
    }

    @GetMapping("/filtradasIdHotel")
    public ResponseEntity<List<ResenaDTO>> getAllResenaFiltroHotelId(
        @RequestParam("idHotel") String idHotel
    ) {
        long idVueloLong = Long.parseLong(idHotel);
        return ResponseEntity.ok(resenaService.findAllFiltroHotelId(idVueloLong));
    }

    @PostMapping
    public ResponseEntity<Long> createResena(@RequestBody @Valid final ResenaDTO resenaDTO) {
        final Long createdId = resenaService.create(resenaDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateResena(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final ResenaDTO resenaDTO) {
        resenaService.update(id, resenaDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResena(@PathVariable(name = "id") final Long id) {
        resenaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/hotelValues")
    public ResponseEntity<Map<Long, String>> getHotelValues() {
        return ResponseEntity.ok(hotelRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Hotel::getId, Hotel::getNombre)));
    }

}
