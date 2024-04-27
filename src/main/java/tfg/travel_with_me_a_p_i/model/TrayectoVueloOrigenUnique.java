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
import tfg.travel_with_me_a_p_i.service.TrayectoVueloService;


/**
 * Validate that the id value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = TrayectoVueloOrigenUnique.TrayectoVueloOrigenUniqueValidator.class
)
public @interface TrayectoVueloOrigenUnique {

    String message() default "{Exists.trayectoVuelo.origen}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class TrayectoVueloOrigenUniqueValidator implements ConstraintValidator<TrayectoVueloOrigenUnique, Long> {

        private final TrayectoVueloService trayectoVueloService;
        private final HttpServletRequest request;

        public TrayectoVueloOrigenUniqueValidator(final TrayectoVueloService trayectoVueloService,
                final HttpServletRequest request) {
            this.trayectoVueloService = trayectoVueloService;
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
            if (currentId != null && value.equals(trayectoVueloService.get(Long.parseLong(currentId)).getOrigen())) {
                // value hasn't changed
                return true;
            }
            return !trayectoVueloService.origenExists(value);
        }

    }

}
