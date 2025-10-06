// js/interactionManager.js

import { playSfx } from './audioManager.js';

// Ahora showDragDropInteraction recibe el grupo para añadir elementos visuales
export function showDragDropInteraction(scene, textObject, visualElementsGroup, onInteractionComplete) {
    const centerX = scene.sys.game.config.width / 2;
    const centerY = scene.sys.game.config.height / 2;

    // 1. Fondo específico de la interacción (usando la clave precargada)
    let background = scene.add.image(centerX, centerY, 'earth-background').setScale(0.8); 
    visualElementsGroup.add(background); // Añade al grupo

    // 2. Zona de destino (Target Zone): La Tierra
    let dropZoneX = centerX; 
    let dropZoneY = centerY + 50; 
    let dropZoneWidth = 250;
    let dropZoneHeight = 250;

    let dropZone = scene.add.zone(dropZoneX, dropZoneY, dropZoneWidth, dropZoneHeight).setRectangleDropZone(dropZoneWidth, dropZoneHeight);
    
    // (Opcional) Visualización de la zona de destino para depuración
    let graphics = scene.add.graphics();
    graphics.lineStyle(2, 0x00ff00);
    graphics.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
    visualElementsGroup.add(graphics); // Añade al grupo

    // 3. Objeto arrastrable (draggable object): La capa protectora (usando la clave precargada)
    let shield = scene.add.image(centerX - 300, centerY, 'shield').setScale(0.7); 
    shield.setInteractive();
    scene.input.setDraggable(shield);
    visualElementsGroup.add(shield); // Añade al grupo

    // Mostrar el texto de la instrucción en el panel de texto principal
    if (textObject && scene.storySteps[scene.currentStep] && scene.storySteps[scene.currentStep].text) {
        textObject.setText(scene.storySteps[scene.currentStep].text[0]); 
        textObject.setVisible(true);
    }


    // Eventos de arrastrar y soltar
    scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    scene.input.on('dragstart', function (pointer, gameObject) {
        gameObject.setTint(0xff69b4);
        scene.children.bringToTop(gameObject);
        gameObject.input.dragStartX = gameObject.x;
        gameObject.input.dragStartY = gameObject.y;
    });

    scene.input.on('dragend', function (pointer, gameObject, dropped) {
        gameObject.clearTint();
        if (!dropped) {
            scene.tweens.add({
                targets: gameObject,
                x: gameObject.input.dragStartX,
                y: gameObject.input.dragStartY,
                duration: 200,
                ease: 'Power2'
            });
        }
    });

    scene.input.on('drop', function (pointer, gameObject, dropZonePhaser) {
        gameObject.x = dropZonePhaser.x;
        gameObject.y = dropZonePhaser.y;
        gameObject.input.enabled = false;

        playSfx(scene, 'sfx_success');

        scene.time.delayedCall(1000, () => {
            scene.input.off('drag');
            scene.input.off('dragstart');
            scene.input.off('dragend');
            scene.input.off('drop');
            if (onInteractionComplete) onInteractionComplete();
        }, [], scene);
    });
}


// --- NUEVA FUNCIÓN: Drag-and-Drop de la Llamarada al Satélite ---
export function showFlareSatelliteInteraction(scene, textObject, visualElementsGroup, onInteractionComplete) {
    const centerX = scene.sys.game.config.width / 2;
    const centerY = scene.sys.game.config.height / 2;

    // 1. Fondo específico de la interacción (por ejemplo, un espacio con estrellas)
    
    let backgroundVideo = scene.add.video(centerX, centerY, 'flare-background').setScale(0.5).setAlpha(0);
    backgroundVideo.setVolume(0);
    backgroundVideo.play(true);
    backgroundVideo.setLoop(true);
    scene.tweens.add({ targets: backgroundVideo, alpha: { from: 0, to: 1 }, duration: 1000 });
    visualElementsGroup.add(backgroundVideo);

    // 2. Zona de destino (Target Zone): El Satélite
    let dropZoneX = centerX + 200; // Posiciona el satélite a la derecha
    let dropZoneY = centerY; 
    let dropZoneWidth = 200; // Ajusta el tamaño del satélite como zona de drop
    let dropZoneHeight = 150;

    let dropZone = scene.add.zone(dropZoneX, dropZoneY, dropZoneWidth, dropZoneHeight).setRectangleDropZone(dropZoneWidth, dropZoneHeight);
    
    // (Opcional) Visualización de la zona de destino para depuración
    let graphics = scene.add.graphics();
    graphics.lineStyle(2, 0xffff00); // Color amarillo para el satélite
    graphics.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height);
    visualElementsGroup.add(graphics);

    // Añade la imagen del satélite visible
    let satelliteImage = scene.add.video(dropZoneX, dropZoneY, 'satellite').setScale(0.5); // Ajusta la escala
    visualElementsGroup.add(satelliteImage);


    // 3. Objeto arrastrable (draggable object): La Llamarada Solar
    let solarFlare = scene.add.image(centerX - 250, centerY, 'solar-flare').setScale(0.4); // Posiciona la llamarada a la izquierda
    solarFlare.setInteractive();
    scene.input.setDraggable(solarFlare);
    visualElementsGroup.add(solarFlare);

    // Mostrar el texto de la instrucción en el panel de texto principal
    if (textObject && scene.storySteps[scene.currentStep] && scene.storySteps[scene.currentStep].text) {
        textObject.setText(scene.storySteps[scene.currentStep].text[0]); 
        textObject.setVisible(true);
    }


    // Eventos de arrastrar y soltar (se reutilizan los de la escena)
    scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    scene.input.on('dragstart', function (pointer, gameObject) {
        gameObject.setTint(0xffa500); // Tinte naranja para la llamarada
        scene.children.bringToTop(gameObject);
        gameObject.input.dragStartX = gameObject.x;
        gameObject.input.dragStartY = gameObject.y;
    });

    scene.input.on('dragend', function (pointer, gameObject, dropped) {
        gameObject.clearTint();
        if (!dropped) {
            scene.tweens.add({
                targets: gameObject,
                x: gameObject.input.dragStartX,
                y: gameObject.input.dragStartY,
                duration: 200,
                ease: 'Power2'
            });
        }
    });

    scene.input.on('drop', function (pointer, gameObject, dropZonePhaser) {
        // Asegúrate de que el objeto soltado sea la llamarada solar
        if (gameObject === solarFlare) {
            gameObject.x = dropZonePhaser.x;
            gameObject.y = dropZonePhaser.y;
            gameObject.input.enabled = false; // Deshabilita más arrastres

            // Opcional: Animar el satélite o la llamarada al caer
            playSfx(scene, 'sfx_success'); // O un SFX de impacto

            // Puedes cambiar la imagen del satélite aquí para mostrar que fue "impactado" o "protegido"
            // Por ejemplo:
            // satelliteImage.setTexture('satellite-damaged'); 
            
            scene.time.delayedCall(1000, () => {
                // Limpia los listeners de arrastre/soltar después de completar la interacción
                scene.input.off('drag');
                scene.input.off('dragstart');
                scene.input.off('dragend');
                scene.input.off('drop');
                if (onInteractionComplete) onInteractionComplete();
            }, [], scene);
        } else {
            // Si se arrastró algo diferente a la llamarada solar (por si hubiera otros objetos arrastrables)
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        }
    });
}