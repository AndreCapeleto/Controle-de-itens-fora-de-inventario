// Variáveis globais
let itemId = 0;
let entryId = 0;
let items = [];

// Função para exibir o conteúdo da seção selecionada
function showContent(contentId) {
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(contentId).style.display = 'block';
}

// Adicionar evento ao formulário de cadastro de itens
document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const partNumber = document.getElementById('partNumber').value;
    const itemDescription = document.getElementById('itemDescription').value;
    addItem(partNumber, itemDescription);
    document.getElementById('addItemForm').reset();
});

// Adicionar evento ao formulário de entrada de itens
document.getElementById('addEntryForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const itemId = document.getElementById('itemSelect').value;
    const entryLocation = document.getElementById('entryLocation').value;
    const entryQuantity = document.getElementById('entryQuantity').value;
    addEntry(itemId, entryLocation, entryQuantity);
    document.getElementById('addEntryForm').reset();
});

// Adicionar evento ao formulário de remoção de entradas
document.getElementById('removeEntryForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const removeId = document.getElementById('removeId').value;
    removeEntry(removeId);
    document.getElementById('removeEntryForm').reset();
});

// Função para adicionar um novo item
function addItem(partNumber, description) {
    items.push({
        id: ++itemId,
        partNumber: partNumber,
        description: description,
        locations: [],
        totalQuantity: 0
    });
    updateItemSelect();
    updateItemsTable();
}

// Função para adicionar uma entrada para um item
function addEntry(itemId, location, quantity) {
    const item = items.find(item => item.id == itemId);
    if (item) {
        item.locations.push({
            entryId: ++entryId,
            location: location,
            quantity: parseInt(quantity)
        });
        item.totalQuantity += parseInt(quantity);
        updateItemsTable();
        generateLabel(item, entryId, location, quantity);
    }
}

// Função para remover uma entrada de um item
function removeEntry(entryId) {
    items.forEach(item => {
        item.locations = item.locations.filter(entry => entry.entryId != entryId);
        item.totalQuantity = item.locations.reduce((sum, entry) => sum + entry.quantity, 0);
    });
    updateItemsTable();
    showPopup('Entrada removida com sucesso!');
}

// Função para atualizar o select de itens
function updateItemSelect() {
    const itemSelect = document.getElementById('itemSelect');
    itemSelect.innerHTML = '<option value="" disabled selected>Selecione um item</option>';
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.partNumber} - ${item.description}`;
        itemSelect.appendChild(option);
    });
}

// Função para atualizar a tabela de itens
function updateItemsTable() {
    const tableBody = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    items.forEach(item => {
        const locations = item.locations.map(loc => `ID: ${loc.entryId} - Locação: ${loc.location}, Quantidade: ${loc.quantity}`).join('<br>');
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td>${item.id}</td>
            <td>${item.partNumber}</td>
            <td>${item.description}</td>
            <td>${locations}</td>
            <td>${item.totalQuantity}</td>
            <td class="actions"><button onclick="removeItem(${item.id})">Remover</button></td>
        `;
    });
}

// Função para remover um item completo
function removeItem(id) {
    // Confirmar remoção
    const confirmation = confirm('Tem certeza de que deseja remover este item?');
    if (confirmation) {
        items = items.filter(item => item.id !== id);
        updateItemSelect();
        updateItemsTable();
        showPopup('Item removido com sucesso!');
    }
}

// Função para gerar uma etiqueta (simulado com um alert)
function generateLabel(item, entryId, location, quantity) {
    const label = `ID: ${entryId}\nDescrição: ${item.description}\nLocação: ${location}`;
    console.log(label);
    alert(label); // Simulando a geração de etiqueta
}

// Função para mostrar um popup com mensagem
function showPopup(message) {
    const popup = document.getElementById('popup');
    document.getElementById('popupMessage').textContent = message;
    popup.style.display = 'flex';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000); // Ocultar após 3 segundos
}

// Função para exportar a tabela para Excel
function exportToExcel() {
    // Obtém a tabela
    const table = document.getElementById('itemsTable');
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

    // Cria um arquivo Excel e inicia o download
    XLSX.writeFile(wb, 'Relatorio_Controle_de_Estoque.xlsx');
}
