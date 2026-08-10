# Tally Web Documentation

These files are tracked with the standalone web repository.

- `prd.md` — shared product requirements snapshot
- `frontend-spec.md` — Next.js architecture and API-consumption contract
- `ui-ux-spec.md` — visual, responsive, and accessibility requirements
- `definition-of-done.md` — frontend release checks
- `frontend-implementation-plan.md` — phased frontend delivery plan

The authoritative runtime API behavior is consumed through the documented HTTP
contract. Coordinate endpoint/payload changes with the separate `api` repository.

For every API change, pin the released `contracts/openapi.json` OpenAPI 3.1
artifact before updating RTK Query endpoint types or frontend behavior. Swagger
UI is available from the API at `/api/v1/docs`.
