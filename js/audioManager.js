// js/audioManager.js

let currentMusicTrack = null; // Para rastrear la música actual y detenerla si cambia

export function initAudio(scene) {
    // Rutas ajustadas a 'assets/audio/' y 'assets/recursos/'
    scene.load.audio('music', 'assets/audio/audioback.mp3'); 
    scene.load.audio('boom', 'assets/audio/boom.mp3');
    scene.load.audio('feliz', 'assets/audio/feliz.mp3');
    scene.load.audio('misterio', 'assets/audio/misterio.mp3');
    scene.load.audio('sol', 'assets/audio/sol.mp3');
    scene.load.audio('espacial', 'assets/audio/espacial.mp3');

    
    // SFX genéricos, asumiendo que están en 'assets/recursos/'
    scene.load.audio('sfx_pop', 'assets/audio/datareveal.mp3'); // Ejemplo con nombre real
    scene.load.audio('sfx_click', 'assets/audio/click.mp3'); // Ejemplo con nombre real
    scene.load.audio('sfx_static', 'assets/audio/static.mp3'); // Ejemplo con nombre real
    scene.load.audio('sfx_success', 'assets/audio/success.mp3'); // SFX para interacción drag-drop
}

// Esta función se llama en Phaser's create() para instanciar los audios
export function createAudioInstances(scene) {
    scene.sound.add('music', { loop: true, volume: 0.4 });
    scene.sound.add('boom', { loop: false, volume: 0.8 });
    scene.sound.add('feliz', { loop: true, volume: 0.5 });
    scene.sound.add('misterio', { loop: true, volume: 0.5 });
    scene.sound.add('sol', { loop: true, volume: 0.5 });
    scene.sound.add('espacial', { loop: true, volume: 0.5 });
    
    // SFX (generalmente no se ponen en loop)
    scene.sound.add('sfx_pop', { loop: false, volume: 0.05 });
    scene.sound.add('sfx_click', { loop: false, volume: 0.3 });
    scene.sound.add('sfx_static', { loop: false, volume: 0.7 });
    scene.sound.add('sfx_success', { loop: false, volume: 0.7 });
}

export function playBackgroundMusic(scene, musicKey, volume = 0.4) {
    let newMusic = scene.sound.get(musicKey);

    if (newMusic) {
        // Si hay una música diferente sonando, la detenemos
        if (currentMusicTrack && currentMusicTrack !== newMusic && currentMusicTrack.isPlaying) {
            currentMusicTrack.stop();
        }

        if (!newMusic.isPlaying) {
            newMusic.play({ loop: true, volume: volume });
        } else if (newMusic.volume !== volume) {
            newMusic.setVolume(volume);
        }
        currentMusicTrack = newMusic; // Actualizamos la música actual
    }
}

export function playSfx(scene, sfxKey, volume = 1) {
    let sfx = scene.sound.get(sfxKey);
    if (sfx) {
        sfx.play({ volume: volume });
    }
}