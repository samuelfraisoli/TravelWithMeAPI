package tfg.travel_with_me_a_p_i.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tfg.travel_with_me_a_p_i.domain.Equipaje;
import tfg.travel_with_me_a_p_i.domain.TrayectoVuelo;
import tfg.travel_with_me_a_p_i.domain.Vuelo;
import tfg.travel_with_me_a_p_i.model.VueloDTO;
import tfg.travel_with_me_a_p_i.repos.EquipajeRepository;
import tfg.travel_with_me_a_p_i.repos.TrayectoVueloRepository;
import tfg.travel_with_me_a_p_i.repos.VueloRepository;
import tfg.travel_with_me_a_p_i.util.NotFoundException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@Service
public class VueloService {

    private final VueloRepository vueloRepository;
    private final EquipajeRepository equipajeRepository;
    private final TrayectoVueloRepository trayectoVueloRepository;

    public VueloService(final VueloRepository vueloRepository,
            final EquipajeRepository equipajeRepository,
            final TrayectoVueloRepository trayectoVueloRepository) {
        this.vueloRepository = vueloRepository;
        this.equipajeRepository = equipajeRepository;
        this.trayectoVueloRepository = trayectoVueloRepository;
    }

    //intenta convertir la fecha, si salta una excepción, va a devolver una List vacía
    public List<VueloDTO> findAllFiltro(String origen, String destino, String fechaString) {
        java.sql.Date fechaSQL = dateStringToSQLDate(fechaString);
        if(fechaSQL != null) {
            final List<Vuelo> vueloes = vueloRepository.findAllFiltro(origen, destino, fechaSQL);
            return vueloes.stream()
                .map(vuelo -> mapToDTO(vuelo, new VueloDTO()))
                .toList();
        }
        List<VueloDTO> vuelos = new ArrayList<>();
        return vuelos;
    }

    public java.sql.Date dateStringToSQLDate(String fechaString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        try {
            // Parsear el String a un objeto Date
            Date parsedDate = dateFormat.parse(fechaString);

            // Convertir el objeto Date a java.sql.Date
            java.sql.Date sqlDate = new java.sql.Date(parsedDate.getTime());

            System.out.println("Fecha en formato java.sql.Date: " + sqlDate);
            return sqlDate;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<VueloDTO> findAll() {
        final List<Vuelo> vueloes = vueloRepository.findAll(Sort.by("id"));
        return vueloes.stream()
                .map(vuelo -> mapToDTO(vuelo, new VueloDTO()))
                .toList();
    }

    public VueloDTO get(final Long id) {
        return vueloRepository.findById(id)
                .map(vuelo -> mapToDTO(vuelo, new VueloDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final VueloDTO vueloDTO) {
        final Vuelo vuelo = new Vuelo();
        mapToEntity(vueloDTO, vuelo);
        return vueloRepository.save(vuelo).getId();
    }

    public void update(final Long id, final VueloDTO vueloDTO) {
        final Vuelo vuelo = vueloRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(vueloDTO, vuelo);
        vueloRepository.save(vuelo);
    }

    public void delete(final Long id) {
        vueloRepository.deleteById(id);
    }

    private VueloDTO mapToDTO(final Vuelo vuelo, final VueloDTO vueloDTO) {
        vueloDTO.setId(vuelo.getId());
        vueloDTO.setIdVuelo(vuelo.getIdVuelo());
        vueloDTO.setAerolinea(vuelo.getAerolinea());
        vueloDTO.setPrecio(vuelo.getPrecio());
        vueloDTO.setTipo(vuelo.getTipo());
        vueloDTO.setOrigen(vuelo.getOrigen());
        vueloDTO.setDestino(vuelo.getDestino());
        vueloDTO.setFecha(vuelo.getFecha());
        vueloDTO.setEquipaje(vuelo.getEquipaje() == null ? null : vuelo.getEquipaje().getId());
        return vueloDTO;
    }

    private Vuelo mapToEntity(final VueloDTO vueloDTO, final Vuelo vuelo) {
        vuelo.setIdVuelo(vueloDTO.getIdVuelo());
        vuelo.setAerolinea(vueloDTO.getAerolinea());
        vuelo.setPrecio(vueloDTO.getPrecio());
        vuelo.setTipo(vueloDTO.getTipo());
        vuelo.setOrigen(vueloDTO.getOrigen());
        vuelo.setDestino(vueloDTO.getDestino());
        vuelo.setFecha(vueloDTO.getFecha());
        final Equipaje equipaje = vueloDTO.getEquipaje() == null ? null : equipajeRepository.findById(vueloDTO.getEquipaje())
                .orElseThrow(() -> new NotFoundException("equipaje not found"));
        vuelo.setEquipaje(equipaje);
        return vuelo;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Vuelo vuelo = vueloRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final TrayectoVuelo vueloTrayectoVuelo = trayectoVueloRepository.findFirstByVuelo(vuelo);
        if (vueloTrayectoVuelo != null) {
            referencedWarning.setKey("vuelo.trayectoVuelo.vuelo.referenced");
            referencedWarning.addParam(vueloTrayectoVuelo.getId());
            return referencedWarning;
        }
        return null;
    }

}
