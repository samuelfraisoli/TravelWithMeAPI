package tfg.travel_with_me_a_p_i.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tfg.travel_with_me_a_p_i.domain.*;
import tfg.travel_with_me_a_p_i.model.HotelDTO;
import tfg.travel_with_me_a_p_i.model.VueloDTO;
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

    //busca los hoteles por nombre en el repositorio, luego los filtra para ver los que tienen todas las fechas
    // disponibles entre las 2 fechas que pasamos
    public List<HotelDTO> findAllFiltro(String nombre, String fecha_entrada, String fecha_salida) {
        Date fecha_entrada_date = dateStringToDate(fecha_entrada);
        Date fecha_salida_date = dateStringToDate(fecha_salida);
        if(fecha_entrada_date != null && fecha_salida_date != null) {
            //busca los hoteles solo por el nombre
            List<Hotel> hoteles = hotelRepository.findAllFiltro(nombre);

            //quita los hoteles que no cumplan las condiciones
            final List<Hotel> hotelesDisponibles = filtrarHotelesPorFechas(hoteles, fecha_entrada_date, fecha_salida_date);
            return hotelesDisponibles.stream()
                .map(hotel -> mapToDTO(hotel, new HotelDTO()))
                .toList();
        }
        List<HotelDTO> hotelesDisponibles = new ArrayList<>();
        return hotelesDisponibles;
    }

    public List<Hotel> filtrarHotelesPorFechas(List<Hotel>hoteles, Date fechaInicio, Date fechaFinal ) {

        List<Hotel> hotelesDisponibles = new ArrayList();
        for(Hotel hotel : hoteles) {
            List<Date> fechasHotel = parseFechasString(hotel.getFechasLibres());
            if(todasFechasPresentes(fechasHotel, fechaInicio, fechaFinal)) {
                hotelesDisponibles.add(hotel);
            }
        }
        return hotelesDisponibles;
    }


    public boolean todasFechasPresentes(List<Date> fechas, Date fechaInicio, Date fechaFinal) {
        Set<Date> todasLasFechas = new HashSet<>();

        // Agregar todas las fechas entre fechaInicio y fechaFinal al conjunto
        Calendar cal = Calendar.getInstance();
        cal.setTime(fechaInicio);
        while (!cal.getTime().after(fechaFinal)) {
            todasLasFechas.add(cal.getTime());
            cal.add(Calendar.DATE, 1);
        }

        // Iterar sobre las fechas en el ArrayList y eliminarlas del conjunto
        for (Date fecha : fechas) {
            todasLasFechas.remove(fecha);
        }

        // Si el conjunto está vacío, significa que todas las fechas están en el ArrayList
        return todasLasFechas.isEmpty();
    }


    //parsea las fechas que tiene cada hotel y lo convierte en un array de strings
    public List<Date> parseFechasString(List<String> fechasString) {
        List<Date> fechas = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        for (String fechaStr : fechasString) {
            try {
                Date fecha = dateFormat.parse(fechaStr);
                fechas.add(fecha);
            } catch (ParseException e) {
                System.err.println("Error al parsear fecha: " + fechaStr);
            }
        }
        return fechas;
    }

    public static Date dateStringToDate(String fechaString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        try {
            // Parsear el String a un objeto Date
            Date parsedDate = dateFormat.parse(fechaString);
            System.out.println("Fecha parseada en formato Date: " + parsedDate);
            return parsedDate;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
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
