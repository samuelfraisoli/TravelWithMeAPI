package tfg.travel_with_me_a_p_i.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tfg.travel_with_me_a_p_i.domain.Direccion;
import tfg.travel_with_me_a_p_i.domain.Hotel;
import tfg.travel_with_me_a_p_i.model.DireccionDTO;
import tfg.travel_with_me_a_p_i.repos.DireccionRepository;
import tfg.travel_with_me_a_p_i.repos.HotelRepository;
import tfg.travel_with_me_a_p_i.util.NotFoundException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@Service
public class DireccionService {

    private final DireccionRepository direccionRepository;
    private final HotelRepository hotelRepository;

    public DireccionService(final DireccionRepository direccionRepository,
            final HotelRepository hotelRepository) {
        this.direccionRepository = direccionRepository;
        this.hotelRepository = hotelRepository;
    }

    public List<DireccionDTO> findAll() {
        final List<Direccion> direccions = direccionRepository.findAll(Sort.by("id"));
        return direccions.stream()
                .map(direccion -> mapToDTO(direccion, new DireccionDTO()))
                .toList();
    }

    public DireccionDTO get(final Long id) {
        return direccionRepository.findById(id)
                .map(direccion -> mapToDTO(direccion, new DireccionDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final DireccionDTO direccionDTO) {
        final Direccion direccion = new Direccion();
        mapToEntity(direccionDTO, direccion);
        return direccionRepository.save(direccion).getId();
    }

    public void update(final Long id, final DireccionDTO direccionDTO) {
        final Direccion direccion = direccionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(direccionDTO, direccion);
        direccionRepository.save(direccion);
    }

    public void delete(final Long id) {
        direccionRepository.deleteById(id);
    }

    private DireccionDTO mapToDTO(final Direccion direccion, final DireccionDTO direccionDTO) {
        direccionDTO.setId(direccion.getId());
        direccionDTO.setDireccionString(direccion.getDireccionString());
        direccionDTO.setDireccion1(direccion.getDireccion1());
        direccionDTO.setDireccion2(direccion.getDireccion2());
        direccionDTO.setCiudad(direccion.getCiudad());
        direccionDTO.setPais(direccion.getPais());
        direccionDTO.setCodPostal(direccion.getCodPostal());
        return direccionDTO;
    }

    private Direccion mapToEntity(final DireccionDTO direccionDTO, final Direccion direccion) {
        direccion.setDireccionString(direccionDTO.getDireccionString());
        direccion.setDireccion1(direccionDTO.getDireccion1());
        direccion.setDireccion2(direccionDTO.getDireccion2());
        direccion.setCiudad(direccionDTO.getCiudad());
        direccion.setPais(direccionDTO.getPais());
        direccion.setCodPostal(direccionDTO.getCodPostal());
        return direccion;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Direccion direccion = direccionRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Hotel direccionHotel = hotelRepository.findFirstByDireccion(direccion);
        if (direccionHotel != null) {
            referencedWarning.setKey("direccion.hotel.direccion.referenced");
            referencedWarning.addParam(direccionHotel.getId());
            return referencedWarning;
        }
        return null;
    }

}
