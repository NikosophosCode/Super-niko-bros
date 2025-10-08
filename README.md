# Super Niko Bros

Proyecto de práctica inspirado en el Mario Bros clásico, construido con [Phaser 3](https://phaser.io/).

## 🚀 Stack

- **Motor**: Phaser 3 (pixel art, física Arcade)
- **Bundler**: Vite (ESM, hot reload)
- **Lenguaje**: JavaScript moderno (ES2022)
- **Assets**: Carpeta `assets/` con sprites, efectos de sonido y fuentes ya incluidos

## 🧱 Arquitectura

```
src/
├── config/          # Configuración compartida (juego, escenas, assets, animaciones)
├── entities/        # Entidades del juego (Mario, enemigos, bloques...) extendiendo Arcade.Sprite
├── managers/        # Servicios globales (carga de assets, audio, event bus)
├── scenes/          # Escenas (Boot, Preloader, MainMenu, Game, UI, GameOver)
├── state/           # Estado global (puntuación, vidas, power-ups)
├── utils/           # Utilidades puras (carga de fuentes, helpers)
└── main.js          # Punto de entrada de Phaser y registro de escenas
```

- **BootScene**: Carga fuentes custom y arranca el `Preloader`.
- **PreloaderScene**: Muestra barra de progreso y usa `AssetLoader` para registrar imágenes, spritesheets, audio y fuentes bitmap.
- **MainMenuScene**: Pantalla principal con instrucciones y transición al juego.
- **GameScene**: Orquesta niveles usando `LevelManager`, delega la creación de entidades al `EntityFactory`, controla la cámara y envía eventos al HUD.
- **UIScene**: HUD desacoplado que escucha eventos (`GameEvents`) para reflejar puntuaciones, monedas, vidas y tiempo.
- **GameOverScene**: Permite reintentar o volver al menú.

### Estado y eventos

- `gameState`: Singleton con información compartida (nivel, puntuación, vidas, power-up actual, temporizador).
- `eventBus`: EventEmitter global que comunica escenas y managers (p.ej. UI se actualiza con `SCORE_CHANGED`).
- `AudioManager`: Encapsula música y efectos, reacciona a eventos (`PAUSE`, `RESUME`, `GAME_OVER`, `LEVEL_COMPLETE`).

### Manifest de assets

Toda la carga se centraliza en `config/assetManifest.js`. Ahí se definen imágenes, spritesheets, audio y fuentes bitmap para mantener la lista en un solo lugar y facilitar el escalado del juego.

## ▶️ Scripts

```bash
npm install     # Instala dependencias (Phaser + Vite)
npm run dev     # Levanta servidor de desarrollo con hot reload
npm run build   # Genera build de producción en dist/
npm run preview # Sirve la build producida para comprobarla
```

> Nota: En Windows PowerShell, ejecuta los comandos dentro de la carpeta raíz del proyecto.

## 🌍 Sistema de niveles

Los niveles se describen en `src/config/levelConfig.js` mediante tilemaps 2D de texto:

- Cada carácter representa un tile (`X` suelo, `B` bloque sólido, `?` bloque de pregunta, `.` vacío, `F` bandera).
- Se definen `enemySpawns`, `collectibleSpawns` y `goal` para colocar entidades.
- `blockTextures` permite reutilizar la misma estructura en estilos overworld/underground.
- `playerSpawn`, `timeLimit` y `nextLevel` controlan progresión y HUD.

`LevelManager` convierte esta configuración en geometría real: crea plataformas, aparece enemigos/coleccionables con `EntityFactory`, sitúa la bandera y ajusta los límites del mundo/cámara. `GameScene` consume esta API para reiniciar, completar y encadenar niveles.

## 🧪 Próximos pasos sugeridos

- Añadir físicas y daño para enemigos (stomps, shells, fireballs) y colisiones avanzadas con bloques.
- Integrar temporizador en HUD y acelerar música cuando quede poco tiempo.
- Escribir pruebas ligeras para `LevelManager`/`gameState` y configurar CI básica.
