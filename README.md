# A-166 Lab

Simulador interactivo de matrices de verdad, diagramas arquitectonicos y modelado de senal para el Doepfer A-166 Dual Logic Module aplicado a acordes, microtonalidad y modulacion en Eurorack.

---

## Contenido del Repositorio

### 1. Aplicacion Web Interactiva: Matriz de Verdad de 16 Estados (`src/App.tsx`)
Una interfaz web interactiva que simula en tiempo real que ocurre cuando combinas las 4 voces del Tubbutec uTune a traves del Doepfer A-166 y el Doepfer A-185-2 Precision Adder hacia la entrada Activate y V/OCT del Make Noise MultiWAVE:
- Tabla de verdad completa de 16 estados (2^4): Visualiza todas las combinaciones posibles de puertas (0000 a 1111) con resaltado en vivo.
- Calculo de articulacion por compuerta OR (>=1): Determina cuando el MultiWAVE dispara (ON +5V) o guarda silencio (OFF 0V).
- Suma de voltaje de tono (1V/Oct): Muestra en voltios la suma analogica precisa que va al jack V/OCT.
- Deteccion de acentos y sincopas: Muestra salidas simultaneas AND y XOR para modular acordes microtonales.
- Interactividad bidireccional: Conmuta las voces manualmente o haz clic en cualquier fila de la tabla para cargar ese estado instantaneamente.

### 2. Diagramas Arquitectonicos Interactivos (Archify)
Archivos HTML completamente autocontenidos (sin dependencias externas, con SVG vectorial interactivo, soporte para Dark/Light mode y trazado de rutas):
- `multiwave-4voice-chord.html`: Diagrama de la arquitectura de Modulation Dissemination para el Make Noise MultiWAVE con el A-185-2 y A-166.
- `a166-microtonal-chords.html`: Diagrama del ruteo polifonico tradicional con el Doepfer A-141-4 Quad VCADSR y banco de osciladores.

---

## Como ejecutar la aplicacion web interactiva en Localhost

Para levantar la aplicacion interactiva de tablas de verdad en tu maquina local:

```bash
# 1. En Windows CMD, cambia a la unidad D:
d:

# 2. Entra en la carpeta del proyecto
cd \DocumentosDiscoD\a-166-lab

# 3. Instala dependencias (solo la primera vez)
npm install

# 4. Inicia el servidor de desarrollo
npm run dev
```

Abre tu navegador en la URL que indique la terminal (por defecto: `http://localhost:5173`).

---

## Como visualizar los diagramas estaticos de Archify

Si solo quieres consultar los diagramas interactivos de flujo de senal:
1. Abre directamente en tu navegador cualquiera de los dos archivos:
   - `multiwave-4voice-chord.html`
   - `a166-microtonal-chords.html`

No requieren dependencias, conexion a internet ni servidor web activo.
