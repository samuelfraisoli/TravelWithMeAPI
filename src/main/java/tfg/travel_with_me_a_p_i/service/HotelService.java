package tfg.travel_with_me_a_p_i.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tfg.travel_with_me_a_p_i.domain.DetallesHotel;
import tfg.travel_with_me_a_p_i.domain.Direccion;
import tfg.travel_with_me_a_p_i.domain.Hotel;
import tfg.travel_with_me_a_p_i.domain.Resena;
import tfg.travel_with_me_a_p_i.model.HotelDTO;
import tfg.travel_with_me_a_p_i.repos.DetallesHotelRepository;
import tfg.travel_with_me_a_p_i.repos.DireccionRepository;
import tfg.travel_with_me_a_p_i.repos.HotelRepository;
import tfg.travel_with_me_a_p_i.repos.ResenaRepository;
import tfg.travel_with_me_a_p_i.util.NotFoundException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final DireccionRepository direccionRepository;
    private final DetallesHotelRepository detallesHotelRepository;
    private final ResenaRepository resenaRepository;

    public HotelService(final HotelRepository hotelRepository,
            final DireccionRepository direccionRepository,
            final DetallesHotelRepository detallesHotelRepository,
            final ResenaRepository resenaRepository) {
        this.hotelRepository = hotelRepository;
        this.direccionRepository = direccionRepository;
        this.detallesHotelRepository = detallesHotelRepository;
        this.resenaRepository = resenaRepository;
    }

    public List<HotelDTO> findAll() {
        final List<Hotel> hotels = hotelRepository.findAll(Sort.by("id"));
        return hotels.stream()
                .map(hotel -> mapToDTO(hotel, new HotelDTO()))
                .toList();
    }

    public HotelDTO get(final Long id) {
        return hotelRepository.findById(id)
                .map(hotel -> mapToDTO(hotel, new HotelDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final HotelDTO hotelDTO) {
        final Hotel hotel = new Hotel();
        mapToEntity(hotelDTO, hotel);
        return hotelRepository.save(hotel).getId();
    }

    public void update(final Long id, final HotelDTO hotelDTO) {
        final Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(hotelDTO, hotel);
        hotelRepository.save(hotel);
    }

    public void delete(final Long id) {
        hotelRepository.deleteById(id);
    }

    private HotelDTO mapToDTO(final Hotel hotel, final HotelDTO hotelDTO) {
        hotelDTO.setId(hotel.getId());
        hotelDTO.setNombre(hotel.getNombre());
        hotelDTO.setFotos(hotel.getFotos());
        hotelDTO.setFechasLibres(hotel.getFechasLibres());
        hotelDTO.setDireccion(hotel.getDireccion() == null ? null : hotel.getDireccion().getId());
        hotelDTO.setDetallesHotel(hotel.getDetallesHotel() == null ? null : hotel.getDetallesHotel().getId());
        return hotelDTO;
    }

    private Hotel mapToEntity(final HotelDTO hotelDTO, final Hotel hotel) {
        hotel.setNombre(hotelDTO.getNombre());
        hotel.setFotos(hotelDTO.getFotos());
        hotel.setFechasLibres(hotelDTO.getFechasLibres());
        final Direccion direccion = hotelDTO.getDireccion() == null ? null : direccionRepository.findById(hotelDTO.getDireccion())
                .orElseThrow(() -> new NotFoundException("direccion not found"));
        hotel.setDireccion(direccion);
        final DetallesHotel detallesHotel = hotelDTO.getDetallesHotel() == null ? null : detallesHotelRepository.findById(hotelDTO.getDetallesHotel())
                .orElseThrow(() -> new NotFoundException("detallesHotel not found"));
        hotel.setDetallesHotel(detallesHotel);
        return hotel;
    }

    public boolean direccionExists(final Long id) {
        return hotelRepository.existsByDireccionId(id);
    }

    public boolean detallesHotelExists(final Long id) {
        return hotelRepository.existsByDetallesHotelId(id);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Resena hotelResena = resenaRepository.findFirstByHotel(hotel);
        if (hotelResena != null) {
            referencedWarning.setKey("hotel.resena.hotel.referenced");
            referencedWarning.addParam(hotelResena.getId());
            return referencedWarning;
        }
        return null;
    }

}
