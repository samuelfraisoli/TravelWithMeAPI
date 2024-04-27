package tfg.travel_with_me_a_p_i.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Map;
import org.springframework.web.servlet.HandlerMapping;
import tfg.travel_with_me_a_p_i.service.HotelService;


/**
 * Validate that the id value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = HotelDetallesHotelUnique.HotelDetallesHotelUniqueValidator.class
)
public @interface HotelDetallesHotelUnique {

    String message() default "{Exists.hotel.detallesHotel}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class HotelDetallesHotelUniqueValidator implements ConstraintValidator<HotelDetallesHotelUnique, Long> {

        private final HotelService hotelService;
        private final HttpServletRequest request;

        public HotelDetallesHotelUniqueValidator(final HotelService hotelService,
                final HttpServletRequest request) {
            this.hotelService = hotelService;
            this.request = request;
        }

        @Override
        public boolean isValid(final Long value, final ConstraintValidatorContext cvContext) {
            if (value == null) {
                // no value present
                return true;
            }
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("id");
            if (currentId != null && value.equals(hotelService.get(Long.parseLong(currentId)).getDetallesHotel())) {
                // value hasn't changed
                return true;
            }
            return !hotelService.detallesHotelExists(value);
        }

    }

}
