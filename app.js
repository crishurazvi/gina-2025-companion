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
    let badgeClass = "";
    if (symptomScore === 0) {
        controlLevel = "Bien contrôlé";
        badgeClass = "bg-success";
    } else if (symptomScore >= 1 && symptomScore <= 2) {
        controlLevel = "Partiellement contrôlé";
        badgeClass = "bg-warning text-dark";
    } else {
        controlLevel = "Non contrôlé";
        badgeClass = "bg-danger";
    }

    // 3. Logique de décision GINA 2025
    let action = "";
    let actionTheme = ""; // pour choisir la couleur de la box glass
    let recommendation = "";
    let trackName = currentTrack === 1 ? "Voie 1 (CSI-formotérol PRN)" : "Voie 2 (BACA PRN)";

    // Notification style iOS pour la sécurité (Checklist GINA)
    const checklistPreEscalade = `
        <div class="glass-alert glass-alert-warning mt-4 p-3 shadow-sm">
            <h6 class="fw-bold mb-2">⚠️ Avant d'escalader le traitement :</h6>
            <ul class="mb-0 small">
                <li>Vérifiez la <strong>technique d'inhalation</strong>.</li>
                <li>Confirmez <strong>l'observance</strong> du traitement.</li>
                <li>Éliminez l'exposition (tabac, vapotage, allergènes).</li>
                <li>Traitez les comorbidités (Rhinite, RGO, Obésité).</li>
            </ul>
        </div>
    `;

    // Logique De-escalade (Step down)
    if (wellControlled3Months && symptomScore === 0) {
        action = "Envisager une DÉ-ESCALADE (Step-Down)";
        actionTheme = "glass-alert-success";
        
        if (currentStep === 0) {
            action = "Initier / Maintenir traitement léger";
            actionTheme = "glass-alert-info";
            recommendation = "Initier Voie 1 (Palier 1-2) si facteurs de risque présents. Sinon observation.";
        } else if (currentStep === 1) {
            action = "Maintenir le Palier 1-2";
            actionTheme = "glass-alert-info";
            recommendation = "Ne pas arrêter complètement les CSI. Continuer CSI-formotérol faible dose à la demande.";
        } else {
            recommendation = `Réduire la dose de CSI de 25 à 50% (ex: passer au Palier ${currentStep - 1}). Choisissez un moment approprié (pas d'infection, pas de grossesse). Assurez-vous que le patient possède un plan d'action écrit.`;
        }
    } 
    // Logique Escalade ou Maintien
    else {
        if (symptomScore === 0) {
            action = "MAINTENIR le traitement";
            actionTheme = "glass-alert-info";
            recommendation = `L'asthme est bien contrôlé. Continuez le traitement au <strong>Palier ${currentStep}</strong>. Prochaine révision dans 3 à 12 mois.`;
        } else {
            // Partiellement ou Non contrôlé = Step Up
            action = "ESCALADE THÉRAPEUTIQUE (Step-Up)";
            actionTheme = "glass-alert-danger";
            
            if (currentStep === 0) {
                 recommendation = currentTrack === 1 ? 
                    "Initier <strong>Palier 1-2 (Voie 1)</strong> : CSI-formotérol faible dose à la demande.<br><br><em>Si symptômes la plupart des jours, initier directement le <strong>Palier 3</strong> (MART).</em>" :
                    "Initier <strong>Palier 2 (Voie 2)</strong> : CSI faible dose quotidien + BACA à la demande.";
            }
            else if (currentStep === 1) {
                recommendation = currentTrack === 1 ? 
                    "Passer au <strong>Palier 3</strong> : CSI-formotérol faible dose en entretien ET à la demande (MART)." : 
                    "Passer au <strong>Palier 3</strong> : CSI-BALA faible dose en entretien + BACA à la demande.<br><br><em>💡 GINA recommande fortement de passer à la Voie 1 (MART) pour réduire le risque d'exacerbation sévère.</em>";
            } else if (currentStep === 3) {
                recommendation = currentTrack === 1 ? 
                    "Passer au <strong>Palier 4</strong> : CSI-formotérol dose moyenne en entretien ET à la demande (MART)." : 
                    "Passer au <strong>Palier 4</strong> : CSI-BALA dose moyenne en entretien + BACA à la demande.";
            } else if (currentStep === 4) {
                recommendation = "Passer au <strong>Palier 5</strong> : Référer à un spécialiste. Envisager évaluation phénotypique, ajout de LAMA, ou thérapies ciblées (anti-IgE, anti-IL5/5R, anti-IL4Ra, anti-TSLP).";
            } else if (currentStep === 5) {
                recommendation = "Optimisation par spécialiste requise. Évaluer l'indication d'une biothérapie ou reconsidérer un asthme sévère difficile à traiter.";
            }
            
            recommendation += checklistPreEscalade;
        }
    }

    // 4. Affichage des résultats avec animation et style Glass
    const resultHtml = `
        <div class="mb-3">
            <span class="opacity-75 d-block mb-1">Bilan clinique :</span>
            <span class="badge ${badgeClass} fs-6 border border-light border-opacity-25 shadow-sm">${controlLevel}</span>
            <span class="ms-2 opacity-75 small">(Score: ${symptomScore}/4)</span>
        </div>
        <div class="mb-4">
            <span class="opacity-75 d-block mb-1">Stratégie actuelle :</span>
            <strong class="fs-6">Palier ${currentStep} - ${trackName}</strong>
        </div>
        
        <div class="glass-alert ${actionTheme} shadow-lg" style="animation: slideIn 0.4s ease-out;">
            <h5 class="mb-3 fw-bold">${action}</h5>
            <p class="mb-0 fs-5 lh-sm" style="font-weight: 300;">${recommendation}</p>
        </div>
        
        <div class="mt-auto pt-3 border-top border-light border-opacity-25 small opacity-50 text-center">
            <strong>Rappel GINA 2025:</strong> Les BACA (SABA) seuls en monothérapie ne sont plus recommandés pour des raisons de sécurité.
        </div>
        
        <style>
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    `;

    document.getElementById('resultArea').innerHTML = resultHtml;
}
