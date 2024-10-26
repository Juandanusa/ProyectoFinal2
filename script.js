
// Objeto para almacenar los candidatos y votos
let candidates = {
    representante: {},
    personero: {},
    contralor: {}
};
let votes = {
    representante: {},
    personero: {},
    contralor: {}
};
let currentCategory = '';
let isAdmin = false;

// Contraseña de administrador 
const ADMIN_PASSWORD = "2091";

// Event listener para el ícono del menú
document.getElementById('menuIcon').addEventListener('click', function(event) {
    event.stopPropagation();
    document.getElementById('mainMenu').classList.toggle('hidden');
});

// Prevenir que el menú se cierre al hacer clic en él
document.getElementById('mainMenu').addEventListener('click', function(event) {
    event.stopPropagation();
});

// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const mainMenu = document.getElementById('mainMenu');
    if (!mainMenu.contains(event.target) && !event.target.matches('#menuIcon, #menuIcon *')) {
        mainMenu.classList.add('hidden');
    }
});

// Función para obtener el nombre del grado
function getGradeName(grade) {
    const gradeNames = {
        '3': 'Tercero', '4': 'Cuarto', '5': 'Quinto',
        '6': 'Sexto', '7': 'Séptimo', '8': 'Octavo',
        '9': 'Noveno', '10': 'Décimo', '11': 'Once'
    };
    return gradeNames[grade] || grade;
}

// Función para actualizar el texto del botón de grado
function updateGradeButtonText(grade, category) {
    const button = document.querySelector(`[data-grade="${grade}"]`);
    if (button) {
        const candidatesCount = candidates[category][grade] ? candidates[category][grade].length : 0;
        const gradeName = button.textContent.split('(')[0].trim();
        button.textContent = `${gradeName} (${candidatesCount})`;
    }
}

// Función para mostrar las opciones de votación
function showVotingOptions() {
    document.getElementById('mainContainer').classList.add('hidden');
    document.getElementById('adminButton').classList.add('hidden');
    document.getElementById('votingOptionsContainer').classList.remove('hidden');
    document.getElementById('menuIcon').classList.remove('hidden');
}

// Función para mostrar las opciones de categoría
function showCategoryOptions(category) {
    currentCategory = category;
    if (category === 'representante') {
        document.getElementById('votingOptionsContainer').classList.add('hidden');
        document.getElementById('categoryOptionsContainer').classList.remove('hidden');
    } else {
        // Para personero y contralor, mostrar directamente los candidatos
        showCandidates('all');
    }
}

// Función para mostrar las opciones de grado según el nivel educativo
function showGradeOptions(level) {
    document.getElementById('categoryOptionsContainer').classList.add('hidden');
    if (level === 'primary') {
        document.getElementById('primaryGradesContainer').classList.remove('hidden');
        document.getElementById('highschoolGradesContainer').classList.add('hidden');
    } else if (level === 'highschool') {
        document.getElementById('primaryGradesContainer').classList.add('hidden');
        document.getElementById('highschoolGradesContainer').classList.remove('hidden');
    }
}

// Función para mostrar los candidatos de un grado y permitir votar
function showCandidates(grade) {
    let candidateList = '';
    if (grade === 'all') {
        // Mostrar todos los candidatos para personero y contralor
        for (let g in candidates[currentCategory]) {
            candidateList += candidates[currentCategory][g].map(candidate => `
                <div class="candidate-vote-card">
                    <img src="${candidate.imageUrl}" alt="${candidate.name}" class="candidate-image">
                    <p>${candidate.name} (${getGradeName(g)})</p>
                    <button onclick="vote('${g}', '${candidate.name}')">Votar</button>
                </div>
            `).join('');
        }
    } else {
        // Mostrar candidatos para un grado específico (representante)
        if (!candidates[currentCategory][grade] || candidates[currentCategory][grade].length === 0) {
            alert(`No hay candidatos registrados para ${getGradeName(grade)} en la categoría ${currentCategory}.`);
            return;
        }
        candidateList = candidates[currentCategory][grade].map(candidate => `
            <div class="candidate-vote-card">
                <img src="${candidate.imageUrl}" alt="${candidate.name}" class="candidate-image">
                <p>${candidate.name}</p>
                <button onclick="vote('${grade}', '${candidate.name}')">Votar</button>
            </div>
        `).join('');
    }

    document.getElementById('candidatesForVoting').innerHTML = `
        <h3>Candidatos para ${currentCategory}:</h3>
        <div class="candidates-grid">${candidateList}</div>
    `;

    document.getElementById('voteContainer').style.display = 'block';
}

// Función para votar
function vote(grade, candidate) {
    if (!votes[currentCategory][grade][candidate]) {
        votes[currentCategory][grade][candidate] = 0;
    }
    votes[currentCategory][grade][candidate]++;
    alert(`Has votado por ${candidate} en ${getGradeName(grade)} para ${currentCategory}.`);
    closeVoteContainer();
    
    // Actualizar los resultados si el modal de resultados está abierto
    if (document.getElementById('resultsModal').style.display === 'block') {
        showResults();
    }
}

// Función para cerrar el modal de votación
function closeVoteContainer() {
    document.getElementById('voteContainer').style.display = 'none';
}

// Función para volver al menú principal
function backToMenu() {
    document.querySelectorAll('.options-container').forEach(container => {
        container.classList.add('hidden');
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });

    document.getElementById('mainMenu').classList.remove('hidden');
}

// Función para volver al inicio
function backToStart() {
    backToMenu();
    document.getElementById('mainContainer').classList.remove('hidden');
    document.getElementById('adminButton').classList.remove('hidden');
    document.getElementById('menuIcon').classList.add('hidden');
    document.getElementById('mainMenu').classList.add('hidden');
}

// Función para mostrar el modal de login de administrador
function showAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

// Función para verificar la contraseña de administrador
function checkAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        showAdminButtons();
        document.getElementById('adminLoginModal').style.display = 'none';
        alert("Acceso de administrador concedido");
    } else {
        alert("Contraseña incorrecta");
    }
}

// Función para mostrar los botones de administrador
function showAdminButtons() {
    document.querySelectorAll('.admin-only').forEach(button => {
        button.classList.remove('hidden');
    });
}

// Función para ocultar los botones de administrador
function hideAdminButtons() {
    document.querySelectorAll('.admin-only').forEach(button => {
        button.classList.add('hidden');
    });
}

// Función para cerrar el acceso administrativo
function closeAdminAccess() {
    isAdmin = false;
    hideAdminButtons();
    closeResultsModal();
    closeAddCandidateForm();
    closeEditCandidatesForm();
    backToStart();
    alert("Acceso administrativo cerrado");
}

// Función para mostrar el formulario de agregar candidato
function showAddCandidateForm() {
    if (isAdmin) {
        document.getElementById('addCandidateForm').style.display = 'block';
        document.getElementById('mainMenu').classList.add('hidden');
    } else {
        alert("Acceso no autorizado");
    }
}

// Función para cerrar el formulario de agregar candidato
function closeAddCandidateForm() {
    document.getElementById('addCandidateForm').style.display = 'none';
}

// Función para agregar un candidato
function addCandidate(name, grade, category, imageUrl) {
    if (!candidates[category][grade]) {
        candidates[category][grade] = [];
    }
    candidates[category][grade].push({ name, imageUrl });

    if (!votes[category][grade]) {
        votes[category][grade] = {};
    }
    votes[category][grade][name] = 0;

    updateGradeButtonText(grade, category);
}

// Event listener para el envío del formulario de candidato
document.getElementById('candidateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('candidateName').value;
    const grade = document.getElementById('candidateGrade').value;
    const category = document.getElementById('candidateCategory').value;
    const imageFile = document.getElementById('candidateImage').files[0];
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            addCandidate(name, grade, category, e.target.result);
            closeAddCandidateForm();
            alert('El candidato ha sido agregado exitosamente.');
        };
        reader.readAsDataURL(imageFile);
    }
});

// Función para mostrar el formulario de edición de candidatos
function showEditCandidatesForm() {
    if (!isAdmin) {
        alert("Acceso no autorizado");
        return;
    }

    const editCandidatesList = document.getElementById('editCandidatesList');
    editCandidatesList.innerHTML = '';

    for (let category in candidates) {
        for (let grade in candidates[category]) {
            candidates[category][grade].forEach((candidate, index) => {
                const candidateCard = createCandidateEditCard(category, grade, candidate, index);
                editCandidatesList.appendChild(candidateCard);
            });
        }
    }

    document.getElementById('editCandidatesForm').style.display = 'block';
    document.getElementById('mainMenu').classList.add('hidden');
}

function createCandidateEditCard(category, grade, candidate, index) {
    const card = document.createElement('div');
    card.className = 'edit-candidate-card';
    card.innerHTML = `
        <img src="${candidate.imageUrl}" alt="${candidate.name}" class="candidate-image-small">
        <form onsubmit="updateCandidate(event, '${category}', '${grade}', ${index})">
            <input type="text" name="name" value="${candidate.name}" required>
            <select name="category">
                ${Object.keys(candidates).map(cat => `
                    <option value="${cat}" ${cat === category ? 'selected' : ''}>${cat}</option>
                `).join('')}
            </select>
            <select name="grade">
                ${Object.keys(candidates[category]).map(g => `
                    <option value="${g}" ${g === grade ? 'selected' : ''}>${getGradeName(g)}</option>
                `).join('')}
            </select>
            <input type="file" name="image" accept="image/*">
            <button type="submit">Actualizar</button>
            <button type="button" onclick="deleteCandidate('${category}', '${grade}', ${index})">Eliminar</button>
        </form>
    `;
    return card;
}

function updateCandidate(event, oldCategory, oldGrade, index) {
    event.preventDefault();
    const form = event.target;
    const newName = form.name.value;
    const newCategory = form.category.value;
    const newGrade = form.grade.value;
    const newImageFile = form.image.files[0];

    if (newImageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updateCandidateData(oldCategory, oldGrade, index, newName, newCategory, newGrade, e.target.result);
        };
        reader.readAsDataURL(newImageFile);
    } else {
        const currentImageUrl = candidates[oldCategory][oldGrade][index].imageUrl;
        updateCandidateData(oldCategory, oldGrade, index, newName, newCategory, newGrade, currentImageUrl);
    }
}

function updateCandidateData(oldCategory, oldGrade, index, newName, newCategory, newGrade, imageUrl) {
    // Remover el candidato de la categoría y grado antiguos
    const [candidate] = candidates[oldCategory][oldGrade].splice(index, 1);


      // Inicializar la nueva categoría y grado si no existen
      if (!candidates[newCategory]) {
        candidates[newCategory] = {};
    }
    if (!candidates[newCategory][newGrade]) {
        candidates[newCategory][newGrade] = [];
    }
    // Añadir el candidato a la nueva categoría y grado
    candidates[newCategory][newGrade].push({name: newName, imageUrl: imageUrl});

    // Actualizar votos
    if (!votes[newCategory]) {
        votes[newCategory] = {};
    }
    if (!votes[newCategory][newGrade]) {
        votes[newCategory][newGrade] = {};
    }

    if (votes[oldCategory] && votes[oldCategory][oldGrade] && votes[oldCategory][oldGrade][candidate.name]) {
        const candidateVotes = votes[oldCategory][oldGrade][candidate.name];
        delete votes[oldCategory][oldGrade][candidate.name];
        votes[newCategory][newGrade][newName] = candidateVotes;
    } else {
        votes[newCategory][newGrade][newName] = 0;
    }

    // Actualizar los botones de grado
    updateGradeButtonText(oldGrade, oldCategory);
    updateGradeButtonText(newGrade, newCategory);

    showEditCandidatesForm(); // Actualizar la lista de candidatos
    alert('Candidato actualizado exitosamente.');
}
  // Actualizar los resultados si el modal está abierto
  if (document.getElementById('resultsModal').style.display === 'block') {
    showResults();
}




function createCandidateEditCard(category, grade, candidate, index) {
    const card = document.createElement('div');
    card.className = 'edit-candidate-card';
    card.innerHTML = `
        <img src="${candidate.imageUrl}" alt="${candidate.name}" class="candidate-image-small">
        <form onsubmit="updateCandidate(event, '${category}', '${grade}', ${index})">
            <input type="text" name="name" value="${candidate.name}" required>
            <select name="category">
                ${Object.keys(candidates).map(cat => `
                    <option value="${cat}" ${cat === category ? 'selected' : ''}>${cat}</option>
                `).join('')}
            </select>
            <select name="grade">
                ${['3', '4', '5', '6', '7', '8', '9', '10', '11'].map(g => `
                    <option value="${g}" ${g === grade ? 'selected' : ''}>${getGradeName(g)}</option>
                `).join('')}
            </select>
            <input type="file" name="image" accept="image/*">
            <button type="submit">Actualizar</button>
            <button type="button" onclick="deleteCandidate('${category}', '${grade}', ${index})">Eliminar</button>
        </form>
    `;
    return card;
}

function deleteCandidate(category, grade, index) {
    const candidate = candidates[category][grade][index];
    if (confirm(`¿Está seguro que desea eliminar a ${candidate.name}?`)) {
        candidates[category][grade].splice(index, 1);
        if (votes[category] && votes[category][grade] && votes[category][grade][candidate.name]) {
            delete votes[category][grade][candidate.name];
        }
        updateGradeButtonText(grade, category);
        showEditCandidatesForm(); // Actualizar la lista de candidatos
        alert('El candidato ha sido eliminado exitosamente.');
    }
}

// Función para cerrar el formulario de edición de candidatos
function closeEditCandidatesForm() {
    document.getElementById('editCandidatesForm').style.display = 'none';
    document.getElementById('mainMenu').classList.remove('hidden');
}

// Agregar event listener para el botón de cerrar
document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.querySelector('#editCandidatesForm .close');
    if (closeButton) {
        closeButton.addEventListener('click', closeEditCandidatesForm);
    }
});
// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    
});

// Función para mostrar los resultados
function showResults() {
    if (!isAdmin) {
        alert("Acceso no autorizado");
        return;
    }

    let resultsContent = '';
    for (let category in votes) {
        resultsContent += `<h3>Resultados para ${category}:</h3>`;
        for (let grade in votes[category]) {
            resultsContent += `<h4>${getGradeName(grade)}:</h4>`;
            const candidateVotes = votes[category][grade];
            const sortedCandidates = Object.keys(candidateVotes).sort((a, b) => candidateVotes[b] - candidateVotes[a]);
            
            sortedCandidates.forEach(candidateName => {
                const voteCount = candidateVotes[candidateName];
                const candidate = candidates[category][grade].find(c => c.name === candidateName);
                if (candidate) {
                    resultsContent += `
                        <div class="candidate-result">
                            <img src="${candidate.imageUrl}" alt="${candidateName}" class="candidate-image-small">
                            <p>${candidateName}: ${voteCount} votos</p>
                        </div>
                    `;
                }
            });
        }
    }

    document.getElementById('resultsContent').innerHTML = resultsContent;
    document.getElementById('resultsModal').style.display = 'block';
}

// Función para cerrar el modal de resultados
function closeResultsModal() {
    document.getElementById('resultsModal').style.display = 'none';
}


function getGradeName(grade) {
    const gradeNames = {
        '3': 'Tercero', '4': 'Cuarto', '5': 'Quinto',
        '6': 'Sexto', '7': 'Séptimo', '8': 'Octavo',
        '9': 'Noveno', '10': 'Décimo', '11': 'Once'
    };
    return gradeNames[grade] || grade;
}

// Agregar event listeners cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
   

    // Event listener para el botón de resultados
    const resultsButton = document.getElementById('resultsButton');
    if (resultsButton) {
        resultsButton.addEventListener('click', showResults);
    }

    // Event listener para cerrar el modal de resultados
    const closeResultsButton = document.querySelector('#resultsModal .close');
    if (closeResultsButton) {
        closeResultsButton.addEventListener('click', closeResultsModal);
    }
});