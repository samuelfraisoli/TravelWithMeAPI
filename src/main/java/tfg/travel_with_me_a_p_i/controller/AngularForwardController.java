package tfg.travel_with_me_a_p_i.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


/**
 * Serve Angulars index.html for all requests that are not relevant for the server.
 */
@Controller
public class AngularForwardController {

    @GetMapping("{path:^(?!api|assets|public)[^\\.]*}/**")
    public String handleForward() {
        return "forward:/";
    }

}
