package tfg.travel_with_me_a_p_i.rest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tfg.travel_with_me_a_p_i.domain.DetallesHotel;
import tfg.travel_with_me_a_p_i.domain.Direccion;
import tfg.travel_with_me_a_p_i.model.HotelDTO;
import tfg.travel_with_me_a_p_i.model.VueloDTO;
import tfg.travel_with_me_a_p_i.repos.DetallesHotelRepository;
import tfg.travel_with_me_a_p_i.repos.DireccionRepository;
import tfg.travel_with_me_a_p_i.service.HotelService;
import tfg.travel_with_me_a_p_i.util.CustomCollectors;
import tfg.travel_with_me_a_p_i.util.ReferencedException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@RestController
@RequestMapping(value = "/api/hotels", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class HotelResource {

    private final HotelService hotelService;
    private final DireccionRepository direccionRepository;
    private final DetallesHotelRepository detallesHotelRepository;

    public HotelResource(final HotelService hotelService,
            final DireccionRepository direccionRepository,
            final DetallesHotelRepository detallesHotelRepository) {
        this.hotelService = hotelService;
        this.direccionRepository = direccionRepository;
        this.detallesHotelRepository = detallesHotelRepository;
    }

    @GetMapping("/filtrados")
    public ResponseEntity<List<HotelDTO>> getAllHotelesFiltrados(
        @RequestParam("nombre") String nombre,
        @RequestParam("fecha_entrada") String fecha_entrada,
        @RequestParam("fecha_salida") String fecha_salida) {

        return ResponseEntity.ok(hotelService.findAllFiltro(nombre, fecha_entrada, fecha_salida));
    }

    @GetMapping
    public ResponseEntity<List<HotelDTO>> getAllHotels() {
        return ResponseEntity.ok(hotelService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDTO> getHotel(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(hotelService.get(id));
    }

    @PostMapping
    public ResponseEntity<Long> createHotel(@RequestBody @Valid final HotelDTO hotelDTO) {
        final Long createdId = hotelService.create(hotelDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateHotel(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final HotelDTO hotelDTO) {
        hotelService.update(id, hotelDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = hotelService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        hotelService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/direccionValues")
    public ResponseEntity<Map<Long, String>> getDireccionValues() {
        return ResponseEntity.ok(direccionRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Direccion::getId, Direccion::getDireccionString)));
    }

    @GetMapping("/detallesHotelValues")
    public ResponseEntity<Map<Long, Long>> getDetallesHotelValues() {
        return ResponseEntity.ok(detallesHotelRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(DetallesHotel::getId, DetallesHotel::getId)));
    }

}
