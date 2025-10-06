// js/textManager.js

let revealTextTimer = null; // Para manejar el timer de revelación

export function revealText(scene, textObject, sentence, callback) {
    let currentCharIndex = 0;
    const revealSpeed = 50; // Velocidad de aparición de letras

    textObject.setText(''); // Limpia el texto actual
    textObject.setVisible(true); // Asegurarse de que el texto sea visible

    if (revealTextTimer) {
        revealTextTimer.remove(); // Asegura que no haya un timer anterior activo
        revealTextTimer = null; // Reinicia la referencia
    }

    // Si la oración está vacía, llama al callback inmediatamente
    if (!sentence || sentence.length === 0) {
        scene.time.delayedCall(100, callback, [], scene); // Pequeño delay para asegurar el orden
        return;
    }

    revealTextTimer = scene.time.addEvent({
        delay: revealSpeed,
        callback: () => {
            if (currentCharIndex < sentence.length) {
                textObject.setText(sentence.substring(0, currentCharIndex + 1));
                currentCharIndex++;
                scene.sound.play('sfx_pop', { volume: 0.05 }); // SFX por letra
            } else {
                if (revealTextTimer) { // Verifica si el timer aún existe antes de intentar removerlo
                    revealTextTimer.remove();
                    revealTextTimer = null;
                }
                scene.time.delayedCall(1500, callback, [], scene);
            }
        },
        callbackScope: scene,
        loop: true
    });
}

// Esta función iniciará la revelación de texto para todas las oraciones de un paso
export function startSentenceReveal(scene, textObject, sentences, onCompleteCallback) {
    let currentSentenceIndex = 0;

    const revealNextSentence = () => {
        if (currentSentenceIndex < sentences.length) {
            revealText(scene, textObject, sentences[currentSentenceIndex], () => {
                currentSentenceIndex++;
                revealNextSentence(); // Llama a sí misma para la siguiente oración
            });
        } else {
            // Todas las oraciones de este paso se han revelado
            if (onCompleteCallback) {
                onCompleteCallback();
            }
        }
    };

    revealNextSentence(); // Inicia el proceso
}