**Usage**: Simple ZIP-code lookup API

- **Run**: Start the server locally (PowerShell):

```powershell
npm install
npm start
```

- **Environment**: Copy `.env.example` to `.env` and update values if needed:

```powershell
copy .env.example .env
# then edit .env to set real secrets
```

- **Endpoint**: `GET /api/zip/:code`
  - Example URL: `http://localhost:3001/api/zip/00613`
  - Required header: `x-api-key: clave_segura_123`

- **PowerShell example** (Invoke-RestMethod):

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3001/api/zip/00613" -Headers @{ "x-api-key" = "clave_segura_123" }
```

- **curl example**:

```bash
curl -H "x-api-key: clave_segura_123" http://localhost:3001/api/zip/00613
```

- **Expected responses**:
  - `200 OK` → JSON with `zip`, `ciudad`, `estado` when the zip exists.
  - `400 Bad Request` → invalid ZIP format (validation via Zod). Example formats accepted: `12345` or `12345-6789`.
  - `401 Unauthorized` → missing or invalid `x-api-key` header.
  - `404 Not Found` → ZIP not found in database.
  - `500 Internal Server Error` → server/database error.

- **Notes**:
  - The app uses `express`, `pg` and `zod` for parameter validation. The `:code` param is validated to accept either 5 digits or ZIP+4 (`12345` or `12345-6789`).
  - Keep your real credentials in `.env` and do NOT commit `.env` to the repository. Use `.env.example` for safe, shareable examples.

- **Add to Hg** (PowerShell):

```powershell
hg add .env.example README.md
hg commit -m "Add README and .env.example"
hg push
```

If you want, I can:
- Replace `clave_segura_123` in the example with a placeholder instead of a real-looking key.
- Add a small `GET /health` endpoint to check DB connectivity.
- Create a Postman collection file and add it to the repo.
