// js/stepManager.js

import { playSfx } from './audioManager.js';

export function displayInteractiveButtons(scene, onNextStepCallback, currentInteractive, buttonObject) {
    let buttonText = "";
    let buttonAction = null;

    const sceneButton = buttonObject; 

    if (currentInteractive.includes("btn-start") || currentInteractive.includes("btn-next")) {
        buttonText = currentInteractive.includes("btn-start") ? "Start →" : "Next →";
        buttonAction = () => {
            if (onNextStepCallback) onNextStepCallback();
        };
    } else if (currentInteractive.includes("btn-end")) {
        buttonText = "Back to Home 🏠";
        buttonAction = () => { window.location.href = 'index.html'; };
    } else if (currentInteractive.includes("btn-back")) {
        buttonText = "Back to the Sun ☀️";
        buttonAction = () => {
            // CORREGIDO: Accede a currentStep a través del objeto 'scene'
            scene.currentStep = 0; // Restablece el paso de la escena a 0
            if (onNextStepCallback) onNextStepCallback(); 
        };
    }

    if (!buttonText) {
        if (sceneButton) {
            sceneButton.setVisible(false);
            scene.tweens.killTweensOf(sceneButton);
        }
        return;
    }

    sceneButton.setText(buttonText);
    sceneButton.off('pointerdown');
    sceneButton.on('pointerdown', () => {
        playSfx(scene, 'sfx_click');
        buttonAction();
    });
    sceneButton.setVisible(true);

    sceneButton.setScale(0.9);
    sceneButton.setAlpha(0);

    scene.tweens.add({
        targets: sceneButton,
        alpha: { from: 0, to: 1 },
        scaleX: { from: 0.9, to: 1 },
        scaleY: { from: 0.9, to: 1 },
        y: scene.sys.game.config.height - 50,
        duration: 300,
        ease: 'Sine.easeOut'
    });
}