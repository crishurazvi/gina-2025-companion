function evaluateAsthma() {
    // 1. Récupération des données du formulaire
    const currentStep = parseInt(document.getElementById('currentStep').value);
    const currentTrack = parseInt(document.getElementById('currentTrack').value);
    
    // Calcul du score des symptômes (0 à 4)
    let symptomScore = 0;
    const checkboxes = document.querySelectorAll('.symptom-check');
    checkboxes.forEach(cb => {
        if (cb.checked) symptomScore++;
    });

    const wellControlled3Months = document.getElementById('wellControlled3Months').checked;

    // 2. Détermination du niveau de contrôle
    let controlLevel = "";
    if (symptomScore === 0) controlLevel = "Bien contrôlé";
    else if (symptomScore >= 1 && symptomScore <= 2) controlLevel = "Partiellement contrôlé";
    else controlLevel = "Non contrôlé";

    // 3. Logique de décision GINA 2025
    let action = "";
    let actionClass = "";
    let recommendation = "";
    let trackName = currentTrack === 1 ? "Voie 1 (CSI-formotérol à la demande)" : "Voie 2 (BACA à la demande)";

    // Vérification de sécurité (Page 13, 18 du PDF)
    const checklistPreEscalade = `
        <div class="check-box-alert mt-3">
            <strong>AVANT toute escalade thérapeutique, vérifiez toujours :</strong>
            <ul class="mb-0">
                <li>La technique d'inhalation (observer le patient).</li>
                <li>L'observance du traitement de fond.</li>
                <li>L'exposition aux déclencheurs (tabac, allergènes, vapotage).</li>
                <li>Les comorbidités (rhinite, RGO, obésité).</li>
                <li>Confirmez le diagnostic si ce n'est pas déjà fait.</li>
            </ul>
        </div>
    `;

    // Logique De-escalade (Step down)
    if (wellControlled3Months && symptomScore === 0) {
        action = "Envisager une DE-ESCALADE (Step-Down)";
        actionClass = "step-down";
        if (currentStep === 0) {
            action = "Maintenir / Initier traitement léger";
            actionClass = "maintain";
            recommendation = "Continuer l'observation ou initier Voie 1 Palier 1-2 si facteurs de risque.";
        } else if (currentStep === 1) {
            action = "Maintenir le Palier 1-2";
            actionClass = "maintain";
            recommendation = "Ne pas arrêter complètement les CSI. Continuer CSI-formotérol faible dose à la demande.";
        } else {
            recommendation = `Réduire la dose de CSI de 25 à 50% (ex: passer du Palier ${currentStep} au Palier ${currentStep - 1}). Choisissez un moment approprié (pas d'infection respiratoire, pas de grossesse, pas de voyage). Prévoyez un plan d'action écrit.`;
        }
    } 
    // Logique Escalade ou Maintien
    else {
        if (symptomScore === 0) {
            action = "MAINTENIR le traitement actuel";
            actionClass = "maintain";
            recommendation = `L'asthme est bien contrôlé. Continuez le traitement au Palier ${currentStep}. Révisez dans 3 à 12 mois.`;
        } else {
            // Partiellement ou Non contrôlé = Step Up
            action = "ESCALADE THÉRAPEUTIQUE (Step-Up)";
            actionClass = "step-up";
            
            if (currentStep === 0) {
                 recommendation = currentTrack === 1 ? 
                    "Initier <strong>Palier 1-2 (Voie 1)</strong> : CSI-formotérol faible dose à la demande. Si symptômes la plupart des jours, initier <strong>Palier 3</strong> (MART)." :
                    "Initier <strong>Palier 2 (Voie 2)</strong> : CSI faible dose quotidien + BACA à la demande.";
            }
            else if (currentStep === 1) {
                recommendation = currentTrack === 1 ? 
                    "Passer au <strong>Palier 3</strong> : CSI-formotérol faible dose en entretien ET à la demande (MART)." : 
                    "Passer au <strong>Palier 3</strong> : CSI-BALA faible dose en entretien + BACA à la demande. <br><em>GINA recommande fortement de passer à la Voie 1 (MART) pour réduire le risque d'exacerbation sévère.</em>";
            } else if (currentStep === 3) {
                recommendation = currentTrack === 1 ? 
                    "Passer au <strong>Palier 4</strong> : CSI-formotérol dose moyenne en entretien ET à la demande (MART)." : 
                    "Passer au <strong>Palier 4</strong> : CSI-BALA dose moyenne en entretien + BACA à la demande.";
            } else if (currentStep === 4) {
                recommendation = "Passer au <strong>Palier 5</strong> : Référer à un spécialiste (évaluation phénotypique, ajout LAMA, anti-IgE, anti-IL5/5R, anti-IL4Ra ou anti-TSLP).";
            } else if (currentStep === 5) {
                recommendation = "Optimisation par spécialiste requise. Envisager les biothérapies ou évaluer l'asthme sévère difficile à traiter.";
            }
            
            recommendation += checklistPreEscalade;
        }
    }

    // 4. Affichage des résultats
    const resultHtml = `
        <h5 class="text-primary border-bottom pb-2">Bilan du patient</h5>
        <p><strong>Niveau de contrôle :</strong> <span class="badge ${symptomScore === 0 ? 'bg-success' : (symptomScore <= 2 ? 'bg-warning text-dark' : 'bg-danger')}">${controlLevel}</span> (Score: ${symptomScore}/4)</p>
        <p><strong>Stratégie actuelle :</strong> Palier ${currentStep} - ${trackName}</p>
        
        <div class="${actionClass} mt-4 shadow-sm">
            <h5 class="mb-3">${action}</h5>
            <p class="mb-0" style="font-size: 1.1em;">${recommendation}</p>
        </div>
        
        <div class="mt-4 pt-3 border-top small text-muted">
            <strong>Note GINA 2025:</strong> Les BACA (SABA) seuls ne sont plus recommandés. Tous les adultes et adolescents doivent recevoir un traitement contenant des CSI. Fournissez toujours un plan d'action écrit pour l'asthme.
        </div>
    `;

    document.getElementById('resultArea').innerHTML = resultHtml;
}
