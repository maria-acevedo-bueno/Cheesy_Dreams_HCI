# Cheesy_Dreams_HCI

Para ejecutar el programa, sigue estos pasos:

## 1. Crear un entorno virtual en Python

Desde la terminal, dentro del directorio del proyecto, ejecuta:

```bash
python3 -m venv ipo
```

## 2. Activar el entorno virtual

### En Linux / macOS:

```bash
source ipo/bin/activate
```

### En Windows (PowerShell):

```powershell
.\ipo\Scripts\Activate.ps1
```

## 3. Instalar las dependencias

Dentro del entorno virtual activado, instala los paquetes necesarios desde el archivo `requirements.txt` ubicado en `/app/back`:

```bash
pip install -r app/back/requirements.txt
```

## 4. Ejecutar la aplicación

Finalmente, corre la aplicación con:

```bash
python3 app.py
```
