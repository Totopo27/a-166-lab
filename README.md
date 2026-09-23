# A-166 Lab 🎛️⚡

Diagramas arquitectónicos interactivos y modelado de flujo de señal para el **Doepfer A-166 Dual Logic Module** aplicado a **acordes, microtonalidad y modulación en Eurorack**.

---

## 🚀 ¿Qué contiene este repositorio?

Este laboratorio utiliza [Archify](https://github.com/tt-a1i/archify) para renderizar diagramas arquitectónicos interactivos e independientes en formato HTML que muestran con precisión quirúrgica el flujo de señales modulares:

### 1. Make Noise MultiWAVE: Acorde de 4 Voces (`multiwave-4voice-chord.html`)
Muestra la técnica de **Modulation Dissemination** para generar un acorde microtonal de cuatro voces a partir de un **Tubbutec µTune**:
- **Control de Tono (Pitch CV)**: Las 4 salidas CV del µTune se suman mediante un **Doepfer A-185-2 Precision Adder** (ultra-alta precisión de 0.1% de tolerancia) y se inyectan en la entrada `V/OCT` del MultiWAVE sin perder la afinación en cents.
- **Control de Articulación (Gate)**: Los 4 Gates del µTune se combinan con la compuerta **`OR (≥1)`** del **Doepfer A-166 Dual Logic**, evitando cortocircuitos y disparando la entrada `Activate` del MultiWAVE cuando cualquiera de las voces está activa.

### 2. Polyphonic Microtonal Voicing (`a166-microtonal-chords.html`)
Explora cómo las compuertas lógicas (`AND`, `OR`, `XOR`) actúan como un director armónico abriendo y cerrando dinámicamente las voces de un acorde a través de un **Doepfer A-141-4 Quad Poly VCADSR** para evitar densidades sonoras estáticas y crear voicings evolutivos.

---

## 🖥️ Cómo visualizar los diagramas

Al ser archivos HTML completamente autocontenidos (con SVG vectorial interactivo, soporte para Dark/Light mode y seguimiento de dependencias):

1. Clona este repositorio o descarga los archivos.
2. Abre en tu navegador cualquiera de los dos archivos:
   - `multiwave-4voice-chord.html`
   - `a166-microtonal-chords.html`

No necesitas instalar servidores ni dependencias para ver los flujos.
