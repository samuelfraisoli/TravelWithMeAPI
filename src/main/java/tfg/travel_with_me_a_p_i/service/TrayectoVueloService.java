package tfg.travel_with_me_a_p_i.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tfg.travel_with_me_a_p_i.domain.Aeropuerto;
import tfg.travel_with_me_a_p_i.domain.TrayectoVuelo;
import tfg.travel_with_me_a_p_i.domain.Vuelo;
import tfg.travel_with_me_a_p_i.model.TrayectoVueloDTO;
import tfg.travel_with_me_a_p_i.repos.AeropuertoRepository;
import tfg.travel_with_me_a_p_i.repos.TrayectoVueloRepository;
import tfg.travel_with_me_a_p_i.repos.VueloRepository;
import tfg.travel_with_me_a_p_i.util.NotFoundException;


@Service
public class TrayectoVueloService {

    private final TrayectoVueloRepository trayectoVueloRepository;
    private final VueloRepository vueloRepository;
    private final AeropuertoRepository aeropuertoRepository;

    public TrayectoVueloService(final TrayectoVueloRepository trayectoVueloRepository,
            final VueloRepository vueloRepository,
            final AeropuertoRepository aeropuertoRepository) {
        this.trayectoVueloRepository = trayectoVueloRepository;
        this.vueloRepository = vueloRepository;
        this.aeropuertoRepository = aeropuertoRepository;
    }

    public List<TrayectoVueloDTO> findAllFiltroVueloId(Long idVuelo) {
        final List<TrayectoVuelo> trayectoVueloes = trayectoVueloRepository.findAllFiltroIdVuelo(idVuelo);
        return trayectoVueloes.stream()
            .map(trayectoVuelo -> mapToDTO(trayectoVuelo, new TrayectoVueloDTO()))
            .toList();
    }

    public List<TrayectoVueloDTO> findAll() {
        final List<TrayectoVuelo> trayectoVueloes = trayectoVueloRepository.findAll(Sort.by("id"));
        return trayectoVueloes.stream()
                .map(trayectoVuelo -> mapToDTO(trayectoVuelo, new TrayectoVueloDTO()))
                .toList();
    }

    public TrayectoVueloDTO get(final Long id) {
        return trayectoVueloRepository.findById(id)
                .map(trayectoVuelo -> mapToDTO(trayectoVuelo, new TrayectoVueloDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final TrayectoVueloDTO trayectoVueloDTO) {
        final TrayectoVuelo trayectoVuelo = new TrayectoVuelo();
        mapToEntity(trayectoVueloDTO, trayectoVuelo);
        return trayectoVueloRepository.save(trayectoVuelo).getId();
    }

    public void update(final Long id, final TrayectoVueloDTO trayectoVueloDTO) {
        final TrayectoVuelo trayectoVuelo = trayectoVueloRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(trayectoVueloDTO, trayectoVuelo);
        trayectoVueloRepository.save(trayectoVuelo);
    }

    public void delete(final Long id) {
        trayectoVueloRepository.deleteById(id);
    }

    private TrayectoVueloDTO mapToDTO(final TrayectoVuelo trayectoVuelo,
            final TrayectoVueloDTO trayectoVueloDTO) {
        trayectoVueloDTO.setId(trayectoVuelo.getId());
        trayectoVueloDTO.setIdTrayecto(trayectoVuelo.getIdTrayecto());
        trayectoVueloDTO.setAerolinea(trayectoVuelo.getAerolinea());
        trayectoVueloDTO.setTipo(trayectoVuelo.getTipo());
        trayectoVueloDTO.setFechaSalida(trayectoVuelo.getFechaSalida());
        trayectoVueloDTO.setFechaLlegada(trayectoVuelo.getFechaLlegada());
        trayectoVueloDTO.setEscala(trayectoVuelo.getEscala());
        trayectoVueloDTO.setFechaInicioEscala(trayectoVuelo.getFechaInicioEscala());
        trayectoVueloDTO.setFechaFinEscala(trayectoVuelo.getFechaFinEscala());
        trayectoVueloDTO.setTerminalSalida(trayectoVuelo.getTerminalSalida());
        trayectoVueloDTO.setTerminalLlegada(trayectoVuelo.getTerminalLlegada());
        trayectoVueloDTO.setVuelo(trayectoVuelo.getVuelo() == null ? null : trayectoVuelo.getVuelo().getId());
        trayectoVueloDTO.setOrigen(trayectoVuelo.getOrigen() == null ? null : trayectoVuelo.getOrigen().getId());
        trayectoVueloDTO.setDestino(trayectoVuelo.getDestino() == null ? null : trayectoVuelo.getDestino().getId());
        return trayectoVueloDTO;
    }

    private TrayectoVuelo mapToEntity(final TrayectoVueloDTO trayectoVueloDTO,
            final TrayectoVuelo trayectoVuelo) {
        trayectoVuelo.setIdTrayecto(trayectoVueloDTO.getIdTrayecto());
        trayectoVuelo.setAerolinea(trayectoVueloDTO.getAerolinea());
        trayectoVuelo.setTipo(trayectoVueloDTO.getTipo());
        trayectoVuelo.setFechaSalida(trayectoVueloDTO.getFechaSalida());
        trayectoVuelo.setFechaLlegada(trayectoVueloDTO.getFechaLlegada());
        trayectoVuelo.setEscala(trayectoVueloDTO.getEscala());
        trayectoVuelo.setFechaInicioEscala(trayectoVueloDTO.getFechaInicioEscala());
        trayectoVuelo.setFechaFinEscala(trayectoVueloDTO.getFechaFinEscala());
        trayectoVuelo.setTerminalSalida(trayectoVueloDTO.getTerminalSalida());
        trayectoVuelo.setTerminalLlegada(trayectoVueloDTO.getTerminalLlegada());
        final Vuelo vuelo = trayectoVueloDTO.getVuelo() == null ? null : vueloRepository.findById(trayectoVueloDTO.getVuelo())
                .orElseThrow(() -> new NotFoundException("vuelo not found"));
        trayectoVuelo.setVuelo(vuelo);
        final Aeropuerto origen = trayectoVueloDTO.getOrigen() == null ? null : aeropuertoRepository.findById(trayectoVueloDTO.getOrigen())
                .orElseThrow(() -> new NotFoundException("origen not found"));
        trayectoVuelo.setOrigen(origen);
        final Aeropuerto destino = trayectoVueloDTO.getDestino() == null ? null : aeropuertoRepository.findById(trayectoVueloDTO.getDestino())
                .orElseThrow(() -> new NotFoundException("destino not found"));
        trayectoVuelo.setDestino(destino);
        return trayectoVuelo;
    }

    public boolean origenExists(final Long id) {
        return trayectoVueloRepository.existsByOrigenId(id);
    }

}
