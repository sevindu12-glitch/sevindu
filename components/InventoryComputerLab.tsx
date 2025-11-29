import React, { useState, useMemo } from 'react';
import type { ComputerLab, ItemKey, Inventory } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ITEM_KEYS, SECONDARY_ITEM_KEYS } from '../types';

declare global {
  interface Window {
    jspdf: any;
  }
}

const BASE_ITEM_LABELS: Record<typeof SECONDARY_ITEM_KEYS[number], string> = {
    chairs: 'Chairs',
    desks: 'Desks',
    teacherDesks: 'Teacher Desks',
    teacherChairs: 'Teacher Chairs',
    whiteboards: 'Whiteboard',
    firstAidKits: 'First Aid Kits',
    cupboards: 'Cupboards',
    fans: 'Fans',
    plugTops: 'Plug Tops',
    waterFilters: 'Water Filters',
    displayBoards: 'Display Boards',
    lightbulbsAndHolders: 'Lightbulbs & Holders',
};

const getInitialItems = (defaults: Partial<Record<ItemKey | 'computers', { usable: number; broken: number }>>): Inventory & { computers: { usable: number; broken: number } } => {
    const items = {} as Inventory & { computers: { usable: number; broken: number } };
    for (const key of ITEM_KEYS) {
        items[key] = defaults[key] || { usable: 0, broken: 0 };
    }
    items.computers = defaults.computers || { usable: 0, broken: 0 };
    return items;
};

const initialLabs: ComputerLab[] = [
    { id: '1', name: 'Main Lab', items: getInitialItems({ computers: { usable: 40, broken: 3 }, chairs: { usable: 42, broken: 5 }, desks: { usable: 42, broken: 2 }, teacherDesks: { usable: 1, broken: 0 }, teacherChairs: { usable: 1, broken: 0 }, whiteboards: { usable: 1, broken: 0 }, cupboards: { usable: 4, broken: 0 } }) },
];


const EditableCell: React.FC<{value: string | number; onChange: (value: string) => void; type?: string;}> = ({ value, onChange, type = 'number' }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 bg-transparent p-1 -m-1 rounded-md focus:bg-slate-100 focus:ring-1 focus:ring-blue-500 outline-none text-center"
            min="0"
        />
    );
};


export const InventoryComputerLab: React.FC = () => {
    const [labs, setLabs] = useState<ComputerLab[]>(initialLabs);
    const [newLabName, setNewLabName] = useState('');
    
    const ALL_LAB_KEYS = [...SECONDARY_ITEM_KEYS, 'computers'] as const;
    type LabItemKey = typeof ALL_LAB_KEYS[number];
    const LAB_ITEM_LABELS: Record<LabItemKey, string> = {...BASE_ITEM_LABELS, computers: 'Computers'};


    const totals = useMemo(() => {
        const totalItems = {} as Record<LabItemKey, { usable: number; broken: number }>;
        
        for (const key of ALL_LAB_KEYS) {
            totalItems[key] = { usable: 0, broken: 0 };
        }

        for (const lab of labs) {
            for (const key of ALL_LAB_KEYS) {
                totalItems[key].usable += lab.items[key].usable;
                totalItems[key].broken += lab.items[key].broken;
            }
        }
        return totalItems;
    }, [labs]);

    const handleUpdateLab = (id: string, itemKey: LabItemKey, field: 'usable' | 'broken', value: string) => {
        setLabs(labs.map(lab => {
            if (lab.id === id) {
                const newItems = { ...lab.items };
                if (itemKey in newItems) {
                    newItems[itemKey] = {
                        ...newItems[itemKey],
                        [field]: parseInt(value, 10) || 0
                    };
                }
                return { ...lab, items: newItems };
            }
            return lab;
        }));
    };

    const handleAddLab = (e: React.FormEvent) => {
        e.preventDefault();
        if (newLabName.trim()) {
            const newLab: ComputerLab = {
                id: Date.now().toString(),
                name: newLabName.trim(),
                items: getInitialItems({}),
            };
            setLabs([...labs, newLab]);
            setNewLabName('');
        }
    };

    const handleRemoveLab = (id: string) => {
        setLabs(labs.filter(lab => lab.id !== id));
    };

    const handleDownloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' });
        
        const title = "R/EMB/ROYAL COLLEGE - Computer Lab Inventory";
        
        const head = [['Lab Name', ...ALL_LAB_KEYS.flatMap(key => [LAB_ITEM_LABELS[key], ''])]];
        const subhead = [['', ...Array(ALL_LAB_KEYS.length).fill(['Usable', 'Broken']).flat()]];
        
        const body = labs.map(lab => {
            return [lab.name, ...ALL_LAB_KEYS.flatMap(key => [lab.items[key].usable, lab.items[key].broken])];
        });
        
        const totalRow = [
            'Total',
            ...ALL_LAB_KEYS.flatMap(key => [totals[key].usable, totals[key].broken])
        ];

        doc.setFontSize(18);
        doc.text(title, 14, 22);

        (doc as any).autoTable({
            startY: 30,
            head: head,
            body: [...subhead, ...body],
            foot: [totalRow],
            showFoot: 'last-page',
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', halign: 'center' },
            footStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontStyle: 'bold' },
            didParseCell: function (data: any) {
                if (data.row.index === 0 && data.section === 'body') { // Subheader row
                    data.cell.styles.fillColor = [241, 245, 249];
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.textColor = [51, 65, 85];
                }
                 // Merge main header cells
                if (data.section === 'head' && data.row.index === 0) {
                    if (data.column.index > 0 && data.column.index % 2 !== 0) {
                        data.cell.colSpan = 2;
                    }
                }
            }
        });
        
        doc.save('computer_lab_inventory.pdf');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 border-b pb-3">Manage Classroom Inventory (Computer Lab)</h3>

            <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100">
                        <tr>
                            <th scope="col" rowSpan={2} className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider align-bottom">Lab Name</th>
                            {ALL_LAB_KEYS.map(key => (
                                <th key={key} scope="col" colSpan={2} className="px-6 py-2 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-l">
                                    {LAB_ITEM_LABELS[key]}
                                </th>
                            ))}
                             <th scope="col" rowSpan={2} className="relative px-6 py-3 border-l"><span className="sr-only">Actions</span></th>
                        </tr>
                        <tr>
                            {ALL_LAB_KEYS.map(key => (
                                <React.Fragment key={key}>
                                    <th scope="col" className="px-2 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-l bg-slate-50">Usable</th>
                                    <th scope="col" className="px-2 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-l bg-slate-50">Broken</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {labs.map((lab) => (
                            <tr key={lab.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{lab.name}</td>
                                {ALL_LAB_KEYS.map(key => (
                                     <React.Fragment key={key}>
                                        <td className="px-2 py-2 whitespace-nowrap text-sm text-slate-500 border-l">
                                            <EditableCell value={lab.items[key].usable} onChange={(val) => handleUpdateLab(lab.id, key, 'usable', val)} />
                                        </td>
                                        <td className="px-2 py-2 whitespace-nowrap text-sm text-slate-500 border-l">
                                            <EditableCell value={lab.items[key].broken} onChange={(val) => handleUpdateLab(lab.id, key, 'broken', val)} />
                                        </td>
                                    </React.Fragment>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-l">
                                    <button onClick={() => handleRemoveLab(lab.id)} className="text-red-600 hover:text-red-900" aria-label={`Remove ${lab.name}`}>
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-slate-100 border-t-2 border-slate-300">
                        <tr className="font-bold text-slate-800">
                            <td className="px-6 py-4 text-sm text-left">Total</td>
                             {ALL_LAB_KEYS.map(key => (
                                <React.Fragment key={key}>
                                    <td className="px-2 py-4 text-sm whitespace-nowrap text-center border-l">{totals[key].usable}</td>
                                    <td className="px-2 py-4 text-sm whitespace-nowrap text-center border-l">{totals[key].broken}</td>
                                </React.Fragment>
                            ))}
                            <td className="px-6 py-4 border-l"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <form onSubmit={handleAddLab} className="flex items-end gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-grow">
                    <label htmlFor="newLabName" className="block text-sm font-medium text-slate-600 mb-1">New Lab Name</label>
                    <input id="newLabName" type="text" value={newLabName} onChange={(e) => setNewLabName(e.target.value)} placeholder="e.g., Annex Lab" className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-700 flex items-center justify-center">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Lab
                </button>
            </form>

            <div className="mt-6 text-right">
                <button
                    onClick={handleDownloadPdf}
                    disabled={labs.length === 0}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    Download as PDF
                </button>
            </div>
        </div>
    );
};