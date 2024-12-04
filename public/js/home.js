// Wait for the DOM to load completely
document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the Track Items button
    document.getElementById('trackItemsBtn').addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default action, especially if inside a form
        
        // Mock data for items
        const items = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' },
            { id: 4, name: 'Item 4' },
        ];
        
        // Populate the item list
        const itemList = document.getElementById('itemList');
        itemList.innerHTML = ''; // Clear previous items
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;
            li.onclick = () => showHistoryModal(item.name); // Pass item name to history modal
            itemList.appendChild(li);
        });
        
        document.getElementById('trackItemsModal').style.display = 'block'; // Show modal
    });

    // Function to close the Track Items modal
    window.closeTrackItemsModal = function() {
        document.getElementById('trackItemsModal').style.display = 'none';
    }

    // Function to close the History modal
    window.closeHistoryModal = function() {
        document.getElementById('historyModal').style.display = 'none';
    }

    // Function to show the modification history modal
    window.showHistoryModal = function(itemName) {
        document.getElementById('historyItemName').textContent = itemName;
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = ''; // Clear previous history

        // Mock data for modifications
        const modifications = [
            'Modified on 2024-10-01: Changed quantity from 100 to 90.',
            'Modified on 2024-09-15: Updated location to Warehouse A.',
            'Modified on 2024-08-30: Added new tags.',
            'Modified on 2024-08-01: Changed supplier to Supplier B.',
        ];
        modifications.forEach(mod => {
            const li = document.createElement('li');
            li.textContent = mod;
            historyList.appendChild(li);
        });

        document.getElementById('historyModal').style.display = 'block'; // Show history modal
    }
});
