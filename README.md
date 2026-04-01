# Project_Air
Project_Air is the next gen of TCG
<img width="1280" height="800" alt="Wallpaper" src="https://github.com/user-attachments/assets/a045428f-2fe0-43fe-9ac4-bb2fcf985229" />

## Docker (MySQL + phpMyAdmin)

1. Copy [.env.example](.env.example) to `.env` and adjust values.
2. Start services:

```bash
docker compose up -d
```

3. phpMyAdmin: http://localhost:8080
4. MySQL from host: `localhost:3306`

Default DB service name inside Docker network: `db`.
