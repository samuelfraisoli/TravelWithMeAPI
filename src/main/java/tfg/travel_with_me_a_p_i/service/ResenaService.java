package tfg.travel_with_me_a_p_i.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tfg.travel_with_me_a_p_i.domain.Hotel;
import tfg.travel_with_me_a_p_i.domain.Resena;
import tfg.travel_with_me_a_p_i.domain.TrayectoVuelo;
import tfg.travel_with_me_a_p_i.model.ResenaDTO;
import tfg.travel_with_me_a_p_i.model.TrayectoVueloDTO;
import tfg.travel_with_me_a_p_i.repos.HotelRepository;
import tfg.travel_with_me_a_p_i.repos.ResenaRepository;
import tfg.travel_with_me_a_p_i.util.NotFoundException;


@Service
public class ResenaService {

    private final ResenaRepository resenaRepository;
    private final HotelRepository hotelRepository;

    public ResenaService(final ResenaRepository resenaRepository,
            final HotelRepository hotelRepository) {
        this.resenaRepository = resenaRepository;
        this.hotelRepository = hotelRepository;
    }

    public List<ResenaDTO> findAll() {
        final List<Resena> resenas = resenaRepository.findAll(Sort.by("id"));
        return resenas.stream()
                .map(resena -> mapToDTO(resena, new ResenaDTO()))
                .toList();
    }

    public List<ResenaDTO> findAllFiltroHotelId(Long idHotel) {
        final List<Resena> resenas = resenaRepository.findAllFiltroHotelId(idHotel);
        return resenas.stream()
            .map(resena -> mapToDTO(resena, new ResenaDTO()))
            .toList();
    }

    public ResenaDTO get(final Long id) {
        return resenaRepository.findById(id)
                .map(resena -> mapToDTO(resena, new ResenaDTO()))
                .orElseThrow(NotFoundException::new);
    }


    public Long create(final ResenaDTO resenaDTO) {
        final Resena resena = new Resena();
        mapToEntity(resenaDTO, resena);
        return resenaRepository.save(resena).getId();
    }

    public void update(final Long id, final ResenaDTO resenaDTO) {
        final Resena resena = resenaRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(resenaDTO, resena);
        resenaRepository.save(resena);
    }

    public void delete(final Long id) {
        resenaRepository.deleteById(id);
    }

    private ResenaDTO mapToDTO(final Resena resena, final ResenaDTO resenaDTO) {
        resenaDTO.setId(resena.getId());
        resenaDTO.setIdUsuario(resena.getIdUsuario());
        resenaDTO.setFecha(resena.getFecha());
        resenaDTO.setTitulo(resena.getTitulo());
        resenaDTO.setContenido(resena.getContenido());
        resenaDTO.setNota(resena.getNota());
        resenaDTO.setHotel(resena.getHotel() == null ? null : resena.getHotel().getId());
        return resenaDTO;
    }

    private Resena mapToEntity(final ResenaDTO resenaDTO, final Resena resena) {
        resena.setIdUsuario(resenaDTO.getIdUsuario());
        resena.setFecha(resenaDTO.getFecha());
        resena.setTitulo(resenaDTO.getTitulo());
        resena.setContenido(resenaDTO.getContenido());
        resena.setNota(resenaDTO.getNota());
        final Hotel hotel = resenaDTO.getHotel() == null ? null : hotelRepository.findById(resenaDTO.getHotel())
                .orElseThrow(() -> new NotFoundException("hotel not found"));
        resena.setHotel(hotel);
        return resena;
    }

}
