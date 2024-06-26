# TravelWithMeAPI

TravelWithMeAPI es un servicio web API REST diseñado para crear, modificar, eliminar y proporcionar mediante solicitudes HTTP datos de vuelos y hoteles.

# Tecnologías utilizadas
Backend de la API desarrollado en Java utilizando Spring Boot y Spring Web. 
- Base de datos MySQL.
- Las conexiones a la base de datos son realizadas mediante Hibernate y Spring Data JPA.


Frontend desarrollado en Angular y Bootstrap.
- El backend en Springboot sirve el frontend, y se comunica con él mediante solicitudes HTTP. De esta forma, le envía los datos de hoteles y vuelos que son mostrados a los usuarios.
- Para la recepción de los datos de forma reactiva se utilizan los observables de la biblioteca RXJS.


# Futuras adiciones
- Sistema de registro de usuarios
- Carouseles que permitan ver las fotos de los hoteles
