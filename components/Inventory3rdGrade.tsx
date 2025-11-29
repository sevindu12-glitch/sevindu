
import React, { useState, useMemo } from 'react';
import type { Classroom, Inventory, ItemKey } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ITEM_KEYS, PRIMARY_ITEM_KEYS } from '../types';

declare global {
  interface Window {
    jspdf: any;
  }
}

type PrimaryItemKey = typeof PRIMARY_ITEM_KEYS[number];

const ITEM_LABELS: Record<PrimaryItemKey, string> = {
    childChairs: 'Child Chairs',
    childDesks: 'Child Desks',
    teacherDesks: 'Teacher Desks',
    teacherChairs: 'Teacher Chairs',
    whiteboards: 'Whiteboard',
    blackboards: 'Blackboard',
    cupboards: 'Cupboards',
    fans: 'Fans',
    plugTops: 'Plug Tops',
    waterFilters: 'Water Filters',
    sinks: 'Sinks with Taps',
    firstAidKits: 'First Aid Kits',
    lightbulbsAndHolders: 'Lightbulbs & Holders',
    whiteCubicles: 'White Cubicles',
    learningAidCupboards: 'Learning Aid Cupboards',
    bookshelves: 'Bookshelves',
    workTables: 'Work Tables',
    displayBoards: 'Display Boards',
    mirrors: 'Mirrors',
    stage: 'Stage',
};


const getInitialItems = (defaults: Partial<Record<ItemKey, { usable: number; broken: number }>>): Inventory => {
    const items = {} as Inventory;
    for (const key of ITEM_KEYS) {
        items[key] = defaults[key] || { usable: 0, broken: 0 };
    }
    return items;
};

const defaultPrimaryInventory = { 
    childChairs: {usable: 38, broken: 0}, 
    childDesks: {usable: 38, broken: 0}, 
    teacherDesks: {usable: 1, broken: 0}, 
    teacherChairs: {usable: 1, broken: 0}, 
    whiteboards: {usable: 1, broken: 0}, 
    blackboards: {usable: 1, broken: 0}, 
    cupboards: {usable: 1, broken: 0}, 
    fans: {usable: 2, broken: 1}, 
    plugTops: {usable: 1, broken: 0}, 
    waterFilters: {usable: 1, broken: 0}, 
    sinks: {usable: 1, broken: 0}, 
    firstAidKits: {usable: 1, broken: 0}, 
    lightbulbsAndHolders: {usable: 2, broken: 0}, 
    whiteCubicles: {usable: 0, broken: 0}, 
    learningAidCupboards: {usable: 0, broken: 0}, 
    bookshelves: {usable: 1, broken: 0}, 
    workTables: {usable: 1, broken: 0}, 
    displayBoards: {usable: 1, broken: 0}, 
    mirrors: {usable: 1, broken: 0}, 
    stage: {usable: 0, broken: 0} 
};

const kumuduInventory = {
    ...defaultPrimaryInventory,
    childChairs: { usable: 35, broken: 0 },
    childDesks: { usable: 35, broken: 0 },
    teacherChairs: { usable: 2, broken: 0 },
    fans: { usable: 3, broken: 0 },
    plugTops: { usable: 1, broken: 0 },
    waterFilters: { usable: 0, broken: 0 },
    lightbulbsAndHolders: { usable: 1, broken: 0 },
    learningAidCupboards: { usable: 1, broken: 0 },
    stage: { usable: 1, broken: 0 },
};

const deliyaInventory = {
    ...defaultPrimaryInventory,
    childChairs: { usable: 36, broken: 0 },
    childDesks: { usable: 36, broken: 0 },
    cupboards: { usable: 0, broken: 1 },
    fans: { usable: 2, broken: 1 },
    waterFilters: { usable: 0, broken: 1 },
    learningAidCupboards: { usable: 1, broken: 0 },
    displayBoards: { usable: 0, broken: 0 },
    mirrors: { usable: 0, broken: 0 },
};

const initialClassrooms: Classroom[] = [
    { id: '1', name: 'Kumudu', items: getInitialItems(kumuduInventory)},
    { id: '2', name: 'ROSE', items: getInitialItems(defaultPrimaryInventory)},
    { id: '3', name: 'IDDA', items: getInitialItems(defaultPrimaryInventory)},
    { id: '4', name: 'PICHCHA', items: getInitialItems(defaultPrimaryInventory)},
    { id: '5', name: 'Deliya', items: getInitialItems(deliyaInventory)},
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


export const Inventory3rdGrade: React.FC = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
    const [newClassName, setNewClassName] = useState('');

    const totals = useMemo(() => {
        const totalItems = {} as Record<PrimaryItemKey, { usable: number; broken: number }>;
        
        for (const key of PRIMARY_ITEM_KEYS) {
            totalItems[key] = { usable: 0, broken: 0 };
        }

        for (const classroom of classrooms) {
            for (const key of PRIMARY_ITEM_KEYS) {
                totalItems[key].usable += classroom.items[key].usable;
                totalItems[key].broken += classroom.items[key].broken;
            }
        }
        return totalItems;
    }, [classrooms]);

    const handleUpdateClassroom = (id: string, itemKey: PrimaryItemKey, field: 'usable' | 'broken', value: string) => {
        setClassrooms(classrooms.map(cls => {
            if (cls.id === id) {
                return {
                    ...cls,
                    items: {
                        ...cls.items,
                        [itemKey]: {
                            ...cls.items[itemKey],
                            [field]: parseInt(value, 10) || 0
                        }
                    }
                };
            }
            return cls;
        }));
    };

    const handleAddClassroom = (e: React.FormEvent) => {
        e.preventDefault();
        if (newClassName.trim()) {
            const newClassroom: Classroom = {
                id: Date.now().toString(),
                name: newClassName.trim(),
                items: getInitialItems({}),
            };
            setClassrooms([...classrooms, newClassroom]);
            setNewClassName('');
        }
    };

    const handleRemoveClassroom = (id: string) => {
        setClassrooms(classrooms.filter(cls => cls.id !== id));
    };

    const handleDownloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait' });
        
        classrooms.forEach((cls, index) => {
            if (index > 0) {
                doc.addPage();
            }

            doc.setFontSize(16);
            doc.text(`R/EMB/ROYAL COLLEGE - ${cls.name}`, 14, 20);
            doc.setFontSize(12);
            doc.text(`Grade 3 Inventory`, 14, 28);

            const head = [
                { content: 'Category', styles: { halign: 'left' } },
                { content: 'Quantity', colSpan: 2, styles: { halign: 'center' } }
            ];
            const subhead = ['', 'Usable', 'Broken'];

            const body = PRIMARY_ITEM_KEYS.map(key => {
                const item = cls.items[key];
                return [ITEM_LABELS[key], item.usable, item.broken];
            });

            (doc as any).autoTable({
                startY: 35,
                head: [head],
                body: [subhead, ...body],
                theme: 'grid',
                headStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontStyle: 'bold' },
                didParseCell: function(data: any) {
                    if (data.row.index === 0 && data.section === 'body') { // Subheader
                        data.cell.styles.fillColor = [241, 245, 249];
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.textColor = [51, 65, 85];
                        data.cell.styles.halign = 'center';
                    }
                    if (data.section === 'body' && data.row.index > 0 && data.column.index > 0) { // Quantity columns
                         data.cell.styles.halign = 'center';
                    }
                     if (data.row.index === 0 && data.section === 'body' && data.column.index === 0) {
                        data.cell.styles.fillColor = [255, 255, 255];
                    }
                }
            });
        });

        if (classrooms.length > 0) {
            doc.addPage();
            doc.setFontSize(16);
            doc.text(`R/EMB/ROYAL COLLEGE - Grade 3 Total Summary`, 14, 20);
    
            const summaryHead = [
                { content: 'Category', styles: { halign: 'left' } },
                { content: 'Total Quantity', colSpan: 2, styles: { halign: 'center' } }
            ];
            const summarySubhead = ['', 'Usable', 'Broken'];
    
            const summaryBody = PRIMARY_ITEM_KEYS.map(key => {
                const item = totals[key];
                return [ITEM_LABELS[key], item.usable, item.broken];
            });
    
            const totalUsable = PRIMARY_ITEM_KEYS.reduce((sum, key) => sum + totals[key].usable, 0);
            const totalBroken = PRIMARY_ITEM_KEYS.reduce((sum, key) => sum + totals[key].broken, 0);
            const summaryFoot = ['Grand Total', totalUsable, totalBroken];
    
            (doc as any).autoTable({
                startY: 30,
                head: [summaryHead],
                body: [summarySubhead, ...summaryBody],
                foot: [summaryFoot],
                showFoot: 'last-page',
                theme: 'grid',
                headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
                footStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontStyle: 'bold' },
                didParseCell: function(data: any) {
                    if (data.row.index === 0 && data.section === 'body') { // Subheader
                        data.cell.styles.fillColor = [241, 245, 249];
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.textColor = [51, 65, 85];
                    }
                    if (data.section !== 'head' && data.column.index > 0) {
                         data.cell.styles.halign = 'center';
                    }
                    if (data.row.index === 0 && data.section === 'body' && data.column.index === 0) {
                        data.cell.styles.fillColor = [255, 255, 255];
                    }
                    if (data.section === 'foot') {
                        data.cell.styles.halign = data.column.index === 0 ? 'left' : 'center';
                    }
                }
            });
        }
        
        doc.save('grade_3_classroom_inventory.pdf');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 border-b pb-3">Manage Classroom Inventory (Grade 3)</h3>

            <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100">
                        <tr>
                            <th scope="col" rowSpan={2} className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider align-bottom">Class Room</th>
                            {PRIMARY_ITEM_KEYS.map(key => (
                                <th key={key} scope="col" colSpan={2} className="px-6 py-2 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-l">
                                    {ITEM_LABELS[key]}
                                </th>
                            ))}
                             <th scope="col" rowSpan={2} className="relative px-6 py-3 border-l"><span className="sr-only">Actions</span></th>
                        </tr>
                        <tr>
                            {PRIMARY_ITEM_KEYS.map(key => (
                                <React.Fragment key={key}>
                                    <th scope="col" className="px-2 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-l bg-slate-50">Usable</th>
                                    <th scope="col" className="px-2 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-l bg-slate-50">Broken</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {classrooms.map((cls) => (
                            <tr key={cls.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{cls.name}</td>
                                {PRIMARY_ITEM_KEYS.map(key => (
                                     <React.Fragment key={key}>
                                        <td className="px-2 py-2 whitespace-nowrap text-sm text-slate-500 border-l">
                                            <EditableCell value={cls.items[key].usable} onChange={(val) => handleUpdateClassroom(cls.id, key, 'usable', val)} />
                                        </td>
                                        <td className="px-2 py-2 whitespace-nowrap text-sm text-slate-500 border-l">
                                            <EditableCell value={cls.items[key].broken} onChange={(val) => handleUpdateClassroom(cls.id, key, 'broken', val)} />
                                        </td>
                                    </React.Fragment>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-l">
                                    <button onClick={() => handleRemoveClassroom(cls.id)} className="text-red-600 hover:text-red-900" aria-label={`Remove ${cls.name}`}>
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-slate-100 border-t-2 border-slate-300">
                        <tr className="font-bold text-slate-800">
                            <td className="px-6 py-4 text-sm text-left">Total</td>
                             {PRIMARY_ITEM_KEYS.map(key => (
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

            <form onSubmit={handleAddClassroom} className="flex items-end gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-grow">
                    <label htmlFor="newClassNameGrade3" className="block text-sm font-medium text-slate-600 mb-1">New Class Room Name</label>
                    <input id="newClassNameGrade3" type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="e.g., 3D" className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-700 flex items-center justify-center">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Classroom
                </button>
            </form>

            <div className="mt-6 text-right">
                <button
                    onClick={handleDownloadPdf}
                    disabled={classrooms.length === 0}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    Download as PDF
                </button>
            </div>
        </div>
    );
};
