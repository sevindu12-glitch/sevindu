import React, { useState, useMemo } from 'react';
import type { Classroom, Inventory, ItemKey } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ITEM_KEYS, SECONDARY_ITEM_KEYS } from '../types';

declare global {
  interface Window {
    jspdf: any;
  }
}

const ITEM_LABELS: Record<typeof SECONDARY_ITEM_KEYS[number], string> = {
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


const getInitialItems = (defaults: Partial<Record<ItemKey, { usable: number; broken: number }>>): Inventory => {
    const items = {} as Inventory;
    for (const key of ITEM_KEYS) {
        items[key] = defaults[key] || { usable: 0, broken: 0 };
    }
    return items;
};


const initialClassrooms: Classroom[] = [
    { id: '1', name: '6A', items: getInitialItems({ chairs: {usable: 40, broken: 2}, desks: {usable: 40, broken: 1}, teacherDesks: {usable: 1, broken: 0}, teacherChairs: {usable: 1, broken: 0}, whiteboards: {usable: 1, broken: 0}, cupboards: {usable: 2, broken: 0} })},
    { id: '2', name: '6B', items: getInitialItems({ chairs: {usable: 40, broken: 0}, desks: {usable: 40, broken: 0}, teacherDesks: {usable: 1, broken: 0}, teacherChairs: {usable: 1, broken: 0}, whiteboards: {usable: 1, broken: 0}, cupboards: {usable: 2, broken: 0} })},
    { id: '3', name: '6C', items: getInitialItems({ chairs: {usable: 40, broken: 5}, desks: {usable: 40, broken: 3}, teacherDesks: {usable: 1, broken: 0}, teacherChairs: {usable: 1, broken: 0}, whiteboards: {usable: 1, broken: 0}, cupboards: {usable: 2, broken: 0} })},
    { id: '4', name: '6D', items: getInitialItems({ chairs: {usable: 40, broken: 1}, desks: {usable: 40, broken: 1}, teacherDesks: {usable: 1, broken: 0}, teacherChairs: {usable: 1, broken: 0}, whiteboards: {usable: 1, broken: 0}, cupboards: {usable: 2, broken: 0} })},
    { id: '5', name: '6E', items: getInitialItems({ chairs: {usable: 40, broken: 0}, desks: {usable: 40, broken: 0}, teacherDesks: {usable: 1, broken: 0}, teacherChairs: {usable: 1, broken: 0}, whiteboards: {usable: 1, broken: 0}, cupboards: {usable: 2, broken: 0} })},
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


export const SalarySheet: React.FC = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
    const [newClassName, setNewClassName] = useState('');

    const totals = useMemo(() => {
        const totalItems = {} as Record<ItemKey, { usable: number; broken: number }>;
        
        for (const key of SECONDARY_ITEM_KEYS) {
            totalItems[key] = { usable: 0, broken: 0 };
        }

        for (const classroom of classrooms) {
            for (const key of SECONDARY_ITEM_KEYS) {
                totalItems[key].usable += classroom.items[key].usable;
                totalItems[key].broken += classroom.items[key].broken;
            }
        }
        return totalItems;
    }, [classrooms]);

    const handleUpdateClassroom = (id: string, itemKey: ItemKey, field: 'usable' | 'broken', value: string) => {
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
        const doc = new jsPDF({ orientation: 'landscape' });
        
        const title = "R/EMB/ROYAL COLLEGE - Grade 6 Inventory";
        
        const head = [['Class Room', ...SECONDARY_ITEM_KEYS.flatMap(key => [ITEM_LABELS[key], ''])]];
        const subhead = [['', ...Array(SECONDARY_ITEM_KEYS.length).fill(['Usable', 'Broken']).flat()]];
        
        const body = classrooms.map(cls => {
            return [cls.name, ...SECONDARY_ITEM_KEYS.flatMap(key => [cls.items[key].usable, cls.items[key].broken])];
        });
        
        const totalRow = [
            'Total',
            ...SECONDARY_ITEM_KEYS.flatMap(key => [totals[key].usable, totals[key].broken])
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
        
        doc.save('grade_6_classroom_inventory.pdf');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 border-b pb-3">Manage Classroom Inventory (Grade 6)</h3>

            <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100">
                        <tr>
                            <th scope="col" rowSpan={2} className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider align-bottom">Class Room</th>
                            {SECONDARY_ITEM_KEYS.map(key => (
                                <th key={key} scope="col" colSpan={2} className="px-6 py-2 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-l">
                                    {ITEM_LABELS[key]}
                                </th>
                            ))}
                             <th scope="col" rowSpan={2} className="relative px-6 py-3 border-l"><span className="sr-only">Actions</span></th>
                        </tr>
                        <tr>
                            {SECONDARY_ITEM_KEYS.map(key => (
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
                                {SECONDARY_ITEM_KEYS.map(key => (
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
                             {SECONDARY_ITEM_KEYS.map(key => (
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
                    <label htmlFor="newClassNameGrade6" className="block text-sm font-medium text-slate-600 mb-1">New Class Room Name</label>
                    <input id="newClassNameGrade6" type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="e.g., 6F" className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
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