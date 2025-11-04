# 🛠️ Proyecto: BackendSkTarjetaClub

Este repositorio contiene el backend del sistema *Tarjeta Club* de SuperKompras para la verificación de tarjeta habientes de los formatos Super Kompras, Surtitienda y Acrópolis, desarrollado con **Node.js + Express** y contenerizado con **Docker**.

---

## 📁 Estructura del proyecto

```
├── controllers/             # Lógica de negocio y controladores
├── middlewares/             # Middlewares personalizados
├── routes/                  # Definición de rutas Express
├── pdfs/                    # Archivos PDF generados para QR
├── .env                     # Variables de entorno (no subir a Git)
├── .env.example             # Plantilla para configuración del entorno
├── Dockerfile               # Imagen de Node.js para producción
├── docker-compose.yml       # Ejecución del contenedor en entorno unificado
├── run.sh                   # Script de ejecución del contenedor
├── stop.sh                  # Script para detener el contenedor
├── restart.sh               # Script para reiniciar y escanear el contenedor
├── scan.sh                  # Script escanear el contenedor de forma manual
├── firebase.js              # Integración con Firebase
├── serviceAccountKey.json   # Llave de autenticación para Firebase (no subir a Git)
├── index.js                 # Punto de entrada principal del servidor
├── codigo.errortwilio.js    # Errores relacionados con Twilio
├── package.json             # Dependencias del proyecto
```

---

## 📦 Variables de entorno

Edita el archivo `.env` con tus valores reales.  
Si no existe, puedes crear uno basado en la plantilla :

```bash
cp .env.example .env
```

Asegúrate de incluir valores como:
- `PORT=9000`
- Dominios de Origen
- Credenciales Firebase y otras APIs de Mailjet, Twilio y Hasura

También debes crear el archivo `serviceAccountKey.json` dentro del repositorio, para que al iniciar el proyecto; docker lo considere como archivo funcional de configuración del contenedor y su volumen.

```bash
touch serviceAccountKey.json
```

---

## 🔐 Seguridad CORS

El servidor Express implementa una **lista blanca dinámica** basada en las variables `ORIGIN1`, `ORIGIN2`, etc., desde `.env`. Cualquier origen que no esté en esa lista será rechazado por CORS.

---

## 🧪 Instalación y uso local

### Requisitos:

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Trivy (opcional)](https://aquasecurity.github.io/trivy/) para escaneo de seguridad

### Uso local con npm (sin Docker)

Instalar dependencias
```bash
npm install
```

Ejecutar en servidor local de desarrollo
```bash
npm run dev
```

Ejecutar en servidor
```bash
npm run start
```
---

## 🚀 Ejecución del proyecto con Docker

### Levantar contenedor

```bash
./run.sh
```

### Detener contenedor

```bash
./stop.sh
```

### Reiniciar contenedor y escanear seguridad

```bash
./restart.sh
```

> `restart.sh` escanea con Trivy antes de levantar el backend.

Este script:
- Detiene el contenedor.
- Reconstruye la imagen.
- Escanea la imagen con **Trivy** (si está instalado).
- Levanta el contenedor.

---

## 🧪 Seguridad de imagen

### Escanear manualmente con Trivy

```bash
./scan.sh
```

Este script analiza la imagen Docker con:
- Escaneo con `docker scan` (Snyk).
- Escaneo con `Trivy` filtrando **HIGH** y **CRITICAL**.

---

## ⚙️ Permisos de los scripts `.sh` (Opcional)

Después de clonar el repositorio asegúrate de poder ejecutar los shell scripts, en caso de que no se ejecuten deberás darle permisos de ejecución:

```bash
chmod +x run.sh restart.sh stop.sh scan.sh
```

Posteriormente del comando `chmod +x` a los scripts deberás indicar la instrucción a Git para que le de seguimiento a esa actualización:

```bash
git update-index --chmod=+x run.sh
git update-index --chmod=+x restart.sh
git update-index --chmod=+x stop.sh
git update-index --chmod=+x scan.sh
git commit -m "Agrego permisos ejecutables a shell scripts"
```

---

## 🧼 Mantenimiento

- Ver logs: `docker logs backendsktarjetaclub`
- Ver estado: `docker ps`
- Ver imagen: `docker images`
- Limpiar recursos no usados: `docker system prune -a`

---

## 🔐 Buenas prácticas

- No subas `.env`, `serviceAccountKey.json` ni `node_modules`
- Usa `chmod +x` en scripts `.sh`
- Revisa vulnerabilidades con `./scan.sh`
- Reconstuye la imagen tras un `git pull` con `./restart.sh`

El archivo `serviceAccountKey.json` contiene credenciales privadas para conectarse a Firebase. **No debe incluirse dentro de la imagen Docker.**

Por eso se deben tomar las siguientes en la configuración de docker:

1. Agregar este archivo a `.dockerignore`:

```
serviceAccountKey.json
```

2. Montar el archivo como volumen en `docker-compose.yml`:

```yaml
volumes:
  - ./serviceAccountKey.json:/app/serviceAccountKey.json:ro
```
Esto mantiene el archivo fuera de la imagen, accesible solo en tiempo de ejecución, y como lectura (`ro`).

---

## 🧰 Instalación de herramientas de escaneo

### Instalar `docker scan` (Snyk)

Si no lo tienes instalado, puedes activarlo así:

```bash
docker scan --version
```

Si no responde o te indica que no está disponible, consulta:
https://docs.docker.com/engine/scan/

> Docker Desktop incluye `docker scan` por defecto.

---

### Instalar `Trivy`

En sistemas Ubuntu/Debian:

```bash
sudo apt update
sudo apt install wget apt-transport-https gnupg lsb-release -y

wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo gpg --dearmor -o /usr/share/keyrings/trivy.gpg

echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list

sudo apt update
sudo apt install trivy -y

trivy --version
```

Para otras plataformas, visita:  
👉 https://github.com/aquasecurity/trivy#installation

---

## 📬 Contacto

www.cideapps.com

