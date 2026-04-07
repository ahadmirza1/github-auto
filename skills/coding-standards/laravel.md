# Laravel Standards

- Controllers must be thin
- Business logic in Services/
- Use Form Requests for validation
- Use Jobs for async tasks
- External APIs → Integrations/
- No logic in models except relationships/scopes

Structure:
app/
 ├── Services/
 ├── Jobs/
 ├── Integrations/
 ├── DTOs/
