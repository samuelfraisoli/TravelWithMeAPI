package tfg.travel_with_me_a_p_i.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tfg.travel_with_me_a_p_i.domain.DetallesHotel;
import tfg.travel_with_me_a_p_i.domain.Hotel;
import tfg.travel_with_me_a_p_i.model.DetallesHotelDTO;
import tfg.travel_with_me_a_p_i.repos.DetallesHotelRepository;
import tfg.travel_with_me_a_p_i.repos.HotelRepository;
import tfg.travel_with_me_a_p_i.util.NotFoundException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@Service
public class DetallesHotelService {

    private final DetallesHotelRepository detallesHotelRepository;
    private final HotelRepository hotelRepository;

    public DetallesHotelService(final DetallesHotelRepository detallesHotelRepository,
            final HotelRepository hotelRepository) {
        this.detallesHotelRepository = detallesHotelRepository;
        this.hotelRepository = hotelRepository;
    }

    public List<DetallesHotelDTO> findAll() {
        final List<DetallesHotel> detallesHotels = detallesHotelRepository.findAll(Sort.by("id"));
        return detallesHotels.stream()
                .map(detallesHotel -> mapToDTO(detallesHotel, new DetallesHotelDTO()))
                .toList();
    }

    public DetallesHotelDTO get(final Long id) {
        final DetallesHotelDTO detallesHotelDTO =  detallesHotelRepository.findById(id)
            .map(detallesHotel -> mapToDTO(detallesHotel, new DetallesHotelDTO()))
            .orElseThrow(NotFoundException::new);
        System.out.println(detallesHotelDTO.getDescripcion());
        return detallesHotelDTO;
    }

    public Long create(final DetallesHotelDTO detallesHotelDTO) {
        final DetallesHotel detallesHotel = new DetallesHotel();
        mapToEntity(detallesHotelDTO, detallesHotel);
        return detallesHotelRepository.save(detallesHotel).getId();
    }

    public void update(final Long id, final DetallesHotelDTO detallesHotelDTO) {
        final DetallesHotel detallesHotel = detallesHotelRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(detallesHotelDTO, detallesHotel);
        detallesHotelRepository.save(detallesHotel);
    }

    public void delete(final Long id) {
        detallesHotelRepository.deleteById(id);
    }

    private DetallesHotelDTO mapToDTO(final DetallesHotel detallesHotel,
            final DetallesHotelDTO detallesHotelDTO) {
        detallesHotelDTO.setId(detallesHotel.getId());
        detallesHotelDTO.setDescripcion(detallesHotel.getDescripcion());
        detallesHotelDTO.setWeb(detallesHotel.getWeb());
        detallesHotelDTO.setTelefono(detallesHotel.getTelefono());
        detallesHotelDTO.setComodidades(detallesHotel.getComodidades());
        return detallesHotelDTO;
    }

    private DetallesHotel mapToEntity(final DetallesHotelDTO detallesHotelDTO,
            final DetallesHotel detallesHotel) {
        detallesHotel.setDescripcion(detallesHotelDTO.getDescripcion());
        detallesHotel.setWeb(detallesHotelDTO.getWeb());
        detallesHotel.setTelefono(detallesHotelDTO.getTelefono());
        detallesHotel.setComodidades(detallesHotelDTO.getComodidades());
        return detallesHotel;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final DetallesHotel detallesHotel = detallesHotelRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Hotel detallesHotelHotel = hotelRepository.findFirstByDetallesHotel(detallesHotel);
        if (detallesHotelHotel != null) {
            referencedWarning.setKey("detallesHotel.hotel.detallesHotel.referenced");
            referencedWarning.addParam(detallesHotelHotel.getId());
            return referencedWarning;
        }
        return null;
    }

}
