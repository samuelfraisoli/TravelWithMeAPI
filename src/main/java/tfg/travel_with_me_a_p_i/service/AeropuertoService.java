package tfg.travel_with_me_a_p_i.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tfg.travel_with_me_a_p_i.domain.Aeropuerto;
import tfg.travel_with_me_a_p_i.domain.TrayectoVuelo;
import tfg.travel_with_me_a_p_i.model.AeropuertoDTO;
import tfg.travel_with_me_a_p_i.repos.AeropuertoRepository;
import tfg.travel_with_me_a_p_i.repos.TrayectoVueloRepository;
import tfg.travel_with_me_a_p_i.util.NotFoundException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@Service
public class AeropuertoService {

    private final AeropuertoRepository aeropuertoRepository;
    private final TrayectoVueloRepository trayectoVueloRepository;

    public AeropuertoService(final AeropuertoRepository aeropuertoRepository,
            final TrayectoVueloRepository trayectoVueloRepository) {
        this.aeropuertoRepository = aeropuertoRepository;
        this.trayectoVueloRepository = trayectoVueloRepository;
    }

    public List<AeropuertoDTO> findAll() {
        final List<Aeropuerto> aeropuertoes = aeropuertoRepository.findAll(Sort.by("id"));
        return aeropuertoes.stream()
                .map(aeropuerto -> mapToDTO(aeropuerto, new AeropuertoDTO()))
                .toList();
    }

    public AeropuertoDTO get(final Long id) {
        return aeropuertoRepository.findById(id)
                .map(aeropuerto -> mapToDTO(aeropuerto, new AeropuertoDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final AeropuertoDTO aeropuertoDTO) {
        final Aeropuerto aeropuerto = new Aeropuerto();
        mapToEntity(aeropuertoDTO, aeropuerto);
        return aeropuertoRepository.save(aeropuerto).getId();
    }

    public void update(final Long id, final AeropuertoDTO aeropuertoDTO) {
        final Aeropuerto aeropuerto = aeropuertoRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(aeropuertoDTO, aeropuerto);
        aeropuertoRepository.save(aeropuerto);
    }

    public void delete(final Long id) {
        aeropuertoRepository.deleteById(id);
    }

    private AeropuertoDTO mapToDTO(final Aeropuerto aeropuerto, final AeropuertoDTO aeropuertoDTO) {
        aeropuertoDTO.setId(aeropuerto.getId());
        aeropuertoDTO.setNombre(aeropuerto.getNombre());
        aeropuertoDTO.setCiudad(aeropuerto.getCiudad());
        aeropuertoDTO.setCiudadAbrev(aeropuerto.getCiudadAbrev());
        aeropuertoDTO.setPais(aeropuerto.getPais());
        return aeropuertoDTO;
    }

    private Aeropuerto mapToEntity(final AeropuertoDTO aeropuertoDTO, final Aeropuerto aeropuerto) {
        aeropuerto.setNombre(aeropuertoDTO.getNombre());
        aeropuerto.setCiudad(aeropuertoDTO.getCiudad());
        aeropuerto.setCiudadAbrev(aeropuertoDTO.getCiudadAbrev());
        aeropuerto.setPais(aeropuertoDTO.getPais());
        return aeropuerto;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Aeropuerto aeropuerto = aeropuertoRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final TrayectoVuelo origenTrayectoVuelo = trayectoVueloRepository.findFirstByOrigen(aeropuerto);
        if (origenTrayectoVuelo != null) {
            referencedWarning.setKey("aeropuerto.trayectoVuelo.origen.referenced");
            referencedWarning.addParam(origenTrayectoVuelo.getId());
            return referencedWarning;
        }
        final TrayectoVuelo destinoTrayectoVuelo = trayectoVueloRepository.findFirstByDestino(aeropuerto);
        if (destinoTrayectoVuelo != null) {
            referencedWarning.setKey("aeropuerto.trayectoVuelo.destino.referenced");
            referencedWarning.addParam(destinoTrayectoVuelo.getId());
            return referencedWarning;
        }
        return null;
    }

}
