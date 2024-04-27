package tfg.travel_with_me_a_p_i.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tfg.travel_with_me_a_p_i.domain.Equipaje;
import tfg.travel_with_me_a_p_i.domain.Vuelo;
import tfg.travel_with_me_a_p_i.model.EquipajeDTO;
import tfg.travel_with_me_a_p_i.repos.EquipajeRepository;
import tfg.travel_with_me_a_p_i.repos.VueloRepository;
import tfg.travel_with_me_a_p_i.util.NotFoundException;
import tfg.travel_with_me_a_p_i.util.ReferencedWarning;


@Service
public class EquipajeService {

    private final EquipajeRepository equipajeRepository;
    private final VueloRepository vueloRepository;

    public EquipajeService(final EquipajeRepository equipajeRepository,
            final VueloRepository vueloRepository) {
        this.equipajeRepository = equipajeRepository;
        this.vueloRepository = vueloRepository;
    }

    public List<EquipajeDTO> findAll() {
        final List<Equipaje> equipajes = equipajeRepository.findAll(Sort.by("id"));
        return equipajes.stream()
                .map(equipaje -> mapToDTO(equipaje, new EquipajeDTO()))
                .toList();
    }

    public EquipajeDTO get(final Long id) {
        return equipajeRepository.findById(id)
                .map(equipaje -> mapToDTO(equipaje, new EquipajeDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final EquipajeDTO equipajeDTO) {
        final Equipaje equipaje = new Equipaje();
        mapToEntity(equipajeDTO, equipaje);
        return equipajeRepository.save(equipaje).getId();
    }

    public void update(final Long id, final EquipajeDTO equipajeDTO) {
        final Equipaje equipaje = equipajeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(equipajeDTO, equipaje);
        equipajeRepository.save(equipaje);
    }

    public void delete(final Long id) {
        equipajeRepository.deleteById(id);
    }

    private EquipajeDTO mapToDTO(final Equipaje equipaje, final EquipajeDTO equipajeDTO) {
        equipajeDTO.setId(equipaje.getId());
        equipajeDTO.setPeso(equipaje.getPeso());
        equipajeDTO.setAlto(equipaje.getAlto());
        equipajeDTO.setAncho(equipaje.getAncho());
        equipajeDTO.setPrecio(equipaje.getPrecio());
        return equipajeDTO;
    }

    private Equipaje mapToEntity(final EquipajeDTO equipajeDTO, final Equipaje equipaje) {
        equipaje.setPeso(equipajeDTO.getPeso());
        equipaje.setAlto(equipajeDTO.getAlto());
        equipaje.setAncho(equipajeDTO.getAncho());
        equipaje.setPrecio(equipajeDTO.getPrecio());
        return equipaje;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Equipaje equipaje = equipajeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Vuelo equipajeVuelo = vueloRepository.findFirstByEquipaje(equipaje);
        if (equipajeVuelo != null) {
            referencedWarning.setKey("equipaje.vuelo.equipaje.referenced");
            referencedWarning.addParam(equipajeVuelo.getId());
            return referencedWarning;
        }
        return null;
    }

}
