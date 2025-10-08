# Super Niko Bros

Proyecto de práctica inspirado en el Mario clásico, construido con [Phaser 3](https://phaser.io/) y orientado a experimentar con sistemas arcade modernos: físicas amigables, temporizador reactivo, audio dinámico y un pipeline de pruebas automatizadas.

## � Tabla de contenidos

1. [Stack](#-stack)
2. [Características destacadas](#-características-destacadas)
3. [Controles](#-controles)
4. [Arquitectura del proyecto](#-arquitectura-del-proyecto)
5. [Sistemas de juego](#-sistemas-de-juego)
6. [Sistema de niveles](#-sistema-de-niveles)
7. [Flujo de desarrollo](#-flujo-de-desarrollo)
8. [Pruebas y CI](#-pruebas-y-ci)
9. [Créditos de assets](#-créditos-de-assets)
10. [Próximos pasos sugeridos](#-próximos-pasos-sugeridos)

## �🚀 Stack

- **Motor**: Phaser 3 (pixel art, física Arcade)
- **Bundler**: Vite 5 (ESM, hot reload y build lightning-fast)
- **Lenguaje**: JavaScript moderno (ES2022, módulos nativos)
- **Testing**: Vitest para pruebas unitarias rápidas en Node
- **CI/CD**: GitHub Actions con flujo `install → test → build`
- **Assets**: Carpeta `assets/` con sprites, efectos de sonido y fuentes listas para usar

## ✨ Características destacadas

- **Power-ups completos**: Mario puede crecer o adquirir el estado de fuego; cada estado actualiza sprites y colisionadores.
- **Combate enemigo avanzado**: Stomps, rebotes, Koopas con estados (shell/spin) y derrotas por fuego o cascarón.
- **Fireballs reutilizables**: Proyectiles con físicas, rebotes basados en colisiones y animación de explosión.
- **Bloques inteligentes**: Pregunta (con animación de 3 frames), rompibles y vacíos con rebote animado, payloads configurables y sonidos.
- **Temporizador con modo apuro**: HUD muestra el conteo, cambia de color y acelera la música cuando quedan ≤100 segundos.
- **Audio reactivo**: `AudioManager` mezcla música de nivel y versión “hurry”, además de FX para power-ups, coins, shells, etc.
- **HUD desacoplado**: `UIScene` escucha eventos globales para actualizar puntuación, monedas, vidas y tiempo.
- **Pipeline automatizado**: Vitest cubre `gameState` y `LevelManager`, y un workflow de GitHub Actions ejecuta tests y build en cada PR.

## 🎮 Controles

| Acción                | Tecla |
|-----------------------|-------|
| Mover a la izquierda  | ←     |
| Mover a la derecha    | →     |
| Saltar                | ↑     |
| Correr                | Shift |
| Lanzar fireball       | Space o Z (disponible en estado fuego) |

> Los controles usan el teclado por defecto de Phaser; ajusta `src/entities/Mario.js` si necesitas personalizarlos.

## 🧱 Arquitectura del proyecto

```
src/
├── config/          # Configuración compartida (juego, escenas, assets, animaciones, niveles)
├── entities/        # Entidades del juego (Mario, enemigos, proyectiles, bloques...)
├── managers/        # Servicios globales (asset loader, audio, event bus, level manager)
├── scenes/          # Escenas (Boot, Preloader, MainMenu, Game, UI, GameOver)
├── state/           # Estado global (puntuación, vidas, power-ups, temporizador)
├── utils/           # Utilidades puras (carga de fuentes, helpers)
└── main.js          # Punto de entrada de Phaser y registro de escenas
```

- **BootScene**: Carga fuentes personalizadas y arranca el `Preloader`.
- **PreloaderScene**: Muestra barra de progreso y usa `AssetLoader` para registrar imágenes, spritesheets, audio y fuentes bitmap.
- **MainMenuScene**: Pantalla principal con instrucciones y transición al juego.
- **GameScene**: Orquesta niveles usando `LevelManager`, delega la creación de entidades al `EntityFactory`, controla la cámara y envía eventos al HUD.
- **UIScene**: Interfaz desacoplada que escucha eventos (`GameEvents`) para reflejar puntuaciones, monedas, vidas y tiempo.
- **GameOverScene**: Permite reintentar o volver al menú.

### Estado global y eventos

- `gameState`: Singleton con información compartida (nivel, puntuación, vidas, power-up actual, temporizador).
- `eventBus`: EventEmitter global que comunica escenas y managers (ej. la UI reacciona a `SCORE_CHANGED`, `TIMER_CHANGED`, etc.).
- `AudioManager`: Encapsula música y efectos, reacciona a eventos (`PAUSE`, `RESUME`, `GAME_OVER`, `LEVEL_COMPLETE`, `TIMER_ALMOST_OUT`).
- `EntityFactory`: Punto central para instanciar Mario, enemigos, power-ups, bloques, goal flag y fireballs.

### Manifest de assets

Toda la carga se centraliza en `src/config/assetManifest.js`. Ahí se definen imágenes, spritesheets, audio y fuentes bitmap para mantener la lista en un solo lugar y facilitar el escalado del juego.

## ⚙️ Sistemas de juego

- **Estados de Mario**: `SMALL`, `SUPER` y `FIRE`, con colisionadores, animaciones y lógica de daño personalizada (`takeDamage`, invulnerabilidad temporal, cooldown de fireballs).
- **Bloques con payloads**: `Block` maneja rebotes animados, texturas agotadas y payloads configurables (monedas, hongos, flores). Los bloques rompibles dependen del power-up actual.
- **Enemigos**:
	- `Goomba`: patrulla con IA básica, se derrota por stomp o fireballs.
	- `Koopa`: estados `WALKING`, `SHELL`, `SHELL_SPIN`; puede actuar como proyectil contra otros enemigos.
- **Fireballs**: Proyectil reusado desde un pool; rebota en el suelo, explota al colisionar con paredes o enemigos y se limpia automáticamente fuera de cámara.
- **Temporizador**: `GameScene` decrementa el tiempo cada segundo, emite eventos al HUD, inicia el modo de apuro (color rojo + música acelerada) y causa muerte cuando llega a cero.
- **Audio adaptativo**: Música base + pista “hurry” configurada en `levelConfig`. Transiciones suaves via `AudioManager.fadeOutMusic()`.

## 🌍 Sistema de niveles

Los niveles se describen en `src/config/levelConfig.js` mediante tilemaps 2D de texto:

- Cada carácter representa un tile (`X` suelo, `B` bloque rompible, `?` bloque de pregunta, `.` vacío, `F` bandera).
- Se definen `enemySpawns`, `collectibleSpawns`, `blockContents` y `goal` para colocar entidades.
- `blockTextures` permite reutilizar la misma estructura con estilos overworld/underground.
- `playerSpawn`, `timeLimit`, `hurryMusicKey` y `nextLevel` controlan progresión, HUD y música.

`LevelManager` convierte esta configuración en geometría real: crea plataformas, aparece enemigos/coleccionables con `EntityFactory`, sitúa la bandera y ajusta los límites del mundo/cámara. `GameScene` consume esta API para reiniciar, completar y encadenar niveles.

## 🛠️ Flujo de desarrollo

```powershell
npm install      # Instala dependencias (Phaser, Vite, Vitest)
npm run dev      # Levanta servidor de desarrollo con hot reload (http://localhost:5173)
npm run build    # Genera build de producción en dist/
npm run preview  # Sirve la build producida para comprobarla
npm test         # Ejecuta la suite de Vitest en Node
```

> Ejecuta los comandos desde la raíz del proyecto (PowerShell o cualquier terminal compatible con npm).

## ✅ Pruebas y CI

- **Vitest**: `tests/levelManager.test.js` valida la construcción de niveles, spawns y bloques; `tests/gameState.test.js` cubre puntuaciones, monedas, vidas y temporizador.
- **Cobertura de sistemas**: Las pruebas se enfocan en lógica pura para mantener feedback rápido sin depender del motor.
- **GitHub Actions**: Workflow `.github/workflows/ci.yml` ejecuta `npm ci`, `npm test` y `npm run build` en cada push/PR contra `main`, asegurando que la build y los tests se mantengan verdes.

## 🎨 Créditos de assets

- Sprites, tiles y UI provienen de paquetes de estilo retro incluidos en `assets/` exclusivamente para uso educativo.
- Fuentes: `SuperMario.ttf` y `SuperPlumberBrothers.ttf` para títulos y HUD; `carrier_command` para fuentes bitmap.
- Si reutilizas el proyecto públicamente, revisa licencias individuales y acredita a los autores según corresponda.

## 🧪 Próximos pasos sugeridos

- Añadir más mundos/biomas reutilizando la misma infraestructura de niveles.
- Implementar animaciones de bandera y secuencia de final de nivel.
- Medir cobertura de tests y ampliar a sistemas de físicas específicos (por ejemplo, Fireballs o Koopa shells).
- Optimizar el tamaño del bundle (Vite advierte chunks >500 kB) aplicando división por escenas o compresión de assets.
