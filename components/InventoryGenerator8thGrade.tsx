import React, { useState } from 'react';
import type { InventoryItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

// This lets TypeScript know about the jspdf global and its autoTable plugin
declare global {
  interface Window {
    jspdf: any;
  }
}

export const InventoryGenerator8thGrade: React.FC = () => {
    const [classroomNames, setClassroomNames] = useState('8A, 8B, 8C, 8D, 8E');
    const [items, setItems] = useState<InventoryItem[]>([
        { name: 'Chairs', quantity: 40 },
        { name: 'Desks', quantity: 40 },
    ]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim() && newItemQuantity.trim()) {
            const quantity = parseInt(newItemQuantity, 10);
            if (!isNaN(quantity) && quantity > 0) {
                setItems([...items, { name: newItemName.trim(), quantity }]);
                setNewItemName('');
                setNewItemQuantity('');
            }
        }
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setItems(items.filter((_, index) => index !== indexToRemove));
    };

    const handleDownloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const names = classroomNames.split(',').map(name => name.trim()).filter(Boolean);
        
        if (names.length === 0 || items.length === 0) {
            alert("Please provide classroom names and at least one item.");
            return;
        }
        
        const title = "Grade 8 Summary Report";
        const headers = [['Class', ...items.map(item => item.name), 'Total']];
        
        const rowTotal = items.reduce((sum, item) => sum + item.quantity, 0);

        const body = names.map(name => {
            const rowData = items.map(item => item.quantity);
            return [name, ...rowData, rowTotal];
        });

        doc.setFontSize(18);
        doc.text(title, 14, 22);

        (doc as any).autoTable({
            startY: 30,
            head: headers,
            body: body,
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] }, // blue-600
        });
        
        doc.save(`grade_8_inventory_summary.pdf`);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 border-b pb-3">Create Inventory PDF (Grade 8)</h3>
            
            <div className="mb-4">
                <label htmlFor="classroomNamesGrade8" className="block text-sm font-medium text-slate-600 mb-1">
                    Classroom Names (comma-separated)
                </label>
                <textarea
                    id="classroomNamesGrade8"
                    value={classroomNames}
                    onChange={(e) => setClassroomNames(e.target.value)}
                    placeholder="e.g., 8A, 8B, 8C"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    rows={2}
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-semibold text-slate-700 mb-2">Items</h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Remove</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {items.length > 0 ? items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleRemoveItem(index)} className="text-red-600 hover:text-red-900" aria-label={`Remove ${item.name}`}>
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">No items added yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-slate-50 rounded-lg">
                <div className="md:col-span-1">
                    <label htmlFor="newItemNameGrade8" className="block text-sm font-medium text-slate-600 mb-1">Item Name</label>
                    <input
                        id="newItemNameGrade8"
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="e.g., Whiteboards"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                 <div className="md:col-span-1">
                    <label htmlFor="newItemQuantityGrade8" className="block text-sm font-medium text-slate-600 mb-1">Quantity</label>
                    <input
                        id="newItemQuantityGrade8"
                        type="number"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(e.target.value)}
                        placeholder="e.g., 2"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="md:col-span-1 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 flex items-center justify-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Item
                </button>
            </form>

            <div className="mt-6 text-right">
                 <button
                    onClick={handleDownloadPdf}
                    disabled={items.length === 0 || classroomNames.trim() === ''}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    Download as PDF
                </button>
            </div>
        </div>
    );
};