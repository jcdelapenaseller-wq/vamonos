# Reglas de Desarrollo del Proyecto

## Regla de Proyecto: Hooks en React

Para garantizar la estabilidad y el correcto funcionamiento de los componentes de React, se debe seguir estrictamente la siguiente regla:

**Todos los hooks en componentes deben estar al inicio del componente.**

### Restricciones:
No se permite el uso de hooks en las siguientes situaciones:
- **Dentro de bloques `if`** (o cualquier estructura condicional).
- **Después de una sentencia `return`**.
- **Dentro de bloques JSX**.

Esta regla es fundamental para evitar el error "Rendered more hooks than during the previous render" y asegurar que el orden de ejecución de los hooks sea consistente en cada renderizado.
