// js/sceneMain.js

import { stories } from './storyData.js';
import { initAudio, createAudioInstances, playBackgroundMusic, playSfx } from './audioManager.js';
import { revealText, startSentenceReveal as startTextReveal } from './textManager.js';
import { displayInteractiveButtons } from './stepManager.js'; 
import { showDragDropInteraction } from './interactionManager.js';
import { showFlareSatelliteInteraction } from './interactionManager.js'; 


export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.currentStep = 0;
        this.storySteps = [];
        this.currentButton = null;
        this.textObject = null;
        this.textBackground = null; 
        this.visualElementsGroup = null; 
        this.currentVideo = null; // Para manejar el video actual si solo quieres uno por escena
    }

    preload() {
        initAudio(this);

        this.load.video('vidL1', 'assets/cuento1/vidL1.mp4', 'loadeddata', false);
        this.load.video('vidL2', 'assets/cuento1/vidL2.mp4', 'loadeddata', false);
        this.load.video('vidL3', 'assets/cuento1/vidL3.mp4', 'loadeddata', false);
        this.load.video('vidL4', 'assets/cuento1/vidL4.mp4', 'loadeddata', false);
        this.load.video('vidL5', 'assets/cuento1/vidL5.mp4', 'loadeddata', false);
        this.load.video('vidL6', 'assets/cuento1/vidL6.mp4', 'loadeddata', false);
        this.load.video('vidL7', 'assets/cuento1/vidL7.mp4', 'loadeddata', false);
        this.load.video('vidL8', 'assets/cuento1/vidL8.mp4', 'loadeddata', false);

        this.load.video('videA1', 'assets/cuento2/videA1.mp4', 'loadeddata', false);
        this.load.video('vidA2', 'assets/cuento2/vidA2.mp4', 'loadeddata', false);
        this.load.video('vidA3', 'assets/cuento2/vidA3.mp4', 'loadeddata', false);
        this.load.video('vidA4', 'assets/cuento2/vidA4.mp4', 'loadeddata', false);
        
        this.load.image('earth-background', 'assets/recursos/imgL555.png');
        this.load.image('shield', 'assets/recursos/escudo.png');         
        this.load.image('earth-protected', 'assets/recursos/imgl6666.png');

        this.load.video('vidS1', 'assets/cuento3/vidS1.mp4', 'loadeddata', false);
        this.load.video('vidS2', 'assets/cuento3/vidS2.mp4', 'loadeddata', false);
        this.load.video('vidS3', 'assets/cuento3/vidS3.mp4', 'loadeddata', false);
        this.load.video('vidS4', 'assets/cuento3/vidS4.mp4', 'loadeddata', false);
        this.load.video('vidS5', 'assets/cuento3/vidS5.mp4', 'loadeddata', false);
        this.load.video('vidS6', 'assets/cuento3/vidS6.mp4', 'loadeddata', false);
        this.load.video('vidS7', 'assets/cuento3/vidS7.mp4', 'loadeddata', false);


        this.load.video('flare-background', 'assets/cuento2/videA5.mp4', 'loadeddata', false);
        this.load.video('satellite-damaged', 'assets/cuento2/vidA6.mp4', 'loadeddata', false);
        this.load.image('solar-flare', 'assets/recursos/escudo.png');     // La imagen de la llamarada solar
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedStoryName = urlParams.get('char');
        const storyName = stories[requestedStoryName] ? requestedStoryName : "luma";
        
        this.storySteps = stories[storyName];
        this.currentStep = 0;

        createAudioInstances(this);

        this.visualElementsGroup = this.add.group();

        // Creamos los elementos de UI persistentes una vez al inicio
        // para que no se recreen constantemente si no es necesario.
        const centerX = this.sys.game.config.width / 2;
        const textY = 100;
        const textBackgroundWidth = 900;
        const textBackgroundHeight = 150;

        this.textBackground = this.add.graphics();
        this.textBackground.fillStyle(0xFFFFFF, 0.9);
        this.textBackground.fillRoundedRect(centerX - textBackgroundWidth / 2, textY - textBackgroundHeight / 2, textBackgroundWidth, textBackgroundHeight, 20);
        this.textBackground.setDepth(1).setVisible(false); // Inicialmente oculto

        this.textObject = this.add.text(centerX, textY, '', {
            fontFamily: 'Bitcount Single Ink',
            fontSize: '24px',
            fill: '#333333',
            align: 'center',
            wordWrap: { width: textBackgroundWidth - 40 }
        }).setOrigin(0.5).setDepth(2).setVisible(false); // Inicialmente oculto
        
        const defaultColor = '#0E76A8';
        const hoverColor = '#1F90C9';
        this.currentButton = this.add.text(centerX, this.sys.game.config.height - 50, "", { 
            fontFamily: 'Pixelify Sans', 
            fontSize: '28px', 
            fill: '#FFFFFF', 
            backgroundColor: defaultColor, 
            padding: { x: 25, y: 10 }, 
            shadow: { offsetX: 0, offsetY: 4, color: '#000000', blur: 8, fill: true }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.currentButton.setBackgroundColor(hoverColor)) 
        .on('pointerout', () => this.currentButton.setBackgroundColor(defaultColor))
        .setVisible(false); // Inicialmente oculto
        this.currentButton.setDepth(2);


        WebFont.load({
            google: { families: ['Bitcount Single Ink:500', 'Pixelify Sans:400'] }, // Añadir los pesos si los necesitas
            active: () => {
                this.showStep(); 
            }
        });
    }

    showStep() {
        // Asegúrate de que el currentStep no exceda los límites de la historia
        if (this.currentStep >= this.storySteps.length) {
            console.log("Fin de la historia o paso fuera de límites. Volviendo al inicio.");
            window.location.href = 'index.html'; // Redirige al inicio o maneja el final
            return;
        }

        const current = this.storySteps[this.currentStep];
        
        if (this.visualElementsGroup) {
            this.visualElementsGroup.clear(true, true);
        }
        
        // Detener el video actual si hay uno reproduciéndose
        if (this.currentVideo && this.currentVideo.isPlaying) {
            this.currentVideo.stop();
            this.currentVideo.destroy(); // Destruir para liberar recursos
            this.currentVideo = null;
        }

        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;
        const textY = 100;
        const imageY = centerY + 50;


        // 1. VISIBILIDAD Y CONTENIDO DE UI
        this.textBackground.setVisible(true);
        this.textObject.setVisible(true).setText(''); // Limpiar texto anterior
        this.currentButton.setVisible(false); // Ocultar por defecto

        // 2. LÓGICA DE AUDIO
        if (current.audio) {
            playBackgroundMusic(this, current.audio.music, current.audio.volume);
            if (current.audio.sfx) {
                playSfx(this, current.audio.sfx);
            }
        }

        // 3. LÓGICA DE INTERACCIONES ESPECIALES (Drag-and-Drop)
        if (current.interactive && current.interactive.includes("interactive-drag-earth-shield")) {
            this.currentButton.setVisible(false); 
            this.textObject.setText(current.text[0]); // Mostrar la primera instrucción de la interacción inmediatamente

            showDragDropInteraction(this, this.textObject, this.visualElementsGroup, () => {
                this.currentStep++;
                this.showStep();
            });
            return;
        }
        // **NUEVO: Lógica para la interacción de la Llamarada al Satélite**
        else if (current.interactive && current.interactive.includes("interactive-drag-flare-satellite")) {
            this.currentButton.setVisible(false); 
            this.textObject.setText(current.text[0]); // Muestra la instrucción inicial

            showFlareSatelliteInteraction(this, this.textObject, this.visualElementsGroup, () => {
                this.currentStep++;
                this.showStep();
            });
            return;
        }


        // 4. LÓGICA DE VIDEO (solo si no es una interacción especial)
      // --- MANEJO DE VIDEOS E IMÁGENES ---
        // Se añade un nuevo tipo 'image' en el paso si es una imagen
        if (current.videos && current.videos.length > 0) {
            const assetKey = current.videos[0]; // Usamos 'videos' para ambos por simplicidad en storyData
            
            // Verificamos si la clave corresponde a un video precargado o a una imagen precargada
            if (this.textures.exists(assetKey)) { // Es una IMAGEN
                let image = this.add.image(centerX, imageY, assetKey).setScale(0.8).setAlpha(0); // Ajusta la escala si es necesario
                this.tweens.add({ targets: image, alpha: { from: 0, to: 1 }, duration: 1000 });
                this.visualElementsGroup.add(image);
            } else if (this.cache.video.exists(assetKey)) { // Es un VIDEO
                let video = this.add.video(centerX, imageY, assetKey).setScale(0.5).setAlpha(0);
                video.setVolume(0); 
                video.play(true);
                video.setLoop(true);
                this.tweens.add({ targets: video, alpha: { from: 0, to: 1 }, duration: 1000 });
                this.visualElementsGroup.add(video);
                this.currentVideo = video;
            } else {
                console.warn(`Asset ${assetKey} no encontrado como video ni como imagen.`);
            }
        }
        // 5. LÓGICA DE REVELACIÓN DE TEXTO Y BOTONES ESTÁNDAR
        // Asegúrate de que current.text exista y no esté vacío antes de intentar revelarlo
        if (current.text && current.text.length > 0) {
            startTextReveal(this, this.textObject, current.text, () => {
                displayInteractiveButtons(this, () => {
                    this.currentStep++;
                    this.showStep();
                }, current.interactive, this.currentButton);
            });
        } else {
            // Si no hay texto para revelar, mostrar el botón directamente
            console.warn(`Paso ${this.currentStep} no tiene texto para mostrar.`);
            displayInteractiveButtons(this, () => {
                this.currentStep++;
                this.showStep();
            }, current.interactive, this.currentButton);
        }
    }
}