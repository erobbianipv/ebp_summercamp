import React from 'react';
import { Scenario } from '../types';
import { Plus, X, Save, Copy, Download, Upload } from 'lucide-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import EditableText from './EditableText';

interface ScenarioTabsProps {
  scenarios: Scenario[];
  activeScenarioId: number;
  onSelectScenario: (id: number) => void;
  onAddScenario: () => void;
  onRemoveScenario: (id: number) => void;
  onRenameScenario: (id: number, newName: string) => void;
  onDuplicateScenario: (id: number) => void;
  onSaveScenarios: () => void;
  onExportScenario: () => void;
  onImportScenario: (file: File) => void;
  onReorderScenarios: (startIndex: number, endIndex: number) => void;
}

const ScenarioTabs: React.FC<ScenarioTabsProps> = ({ 
  scenarios, 
  activeScenarioId, 
  onSelectScenario, 
  onAddScenario, 
  onRemoveScenario,
  onRenameScenario,
  onDuplicateScenario,
  onSaveScenarios,
  onExportScenario,
  onImportScenario,
  onReorderScenarios
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportScenario(file);
    }
  };
  return (
    
      <div className="px-4 md:px-8 bg-black border-b border-white/10">
        <div className="flex items-center">
          <Droppable droppableId="scenario-tabs" direction="horizontal" type="SCENARIO">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex items-center"
              >
                {scenarios.map((scenario, index) => (
                  <Draggable key={scenario.id} draggableId={String(scenario.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => onSelectScenario(scenario.id)}
                        className={`flex items-center group cursor-pointer border-b-2 py-3 px-4 text-sm font-medium transition-colors ${
                          activeScenarioId === scenario.id
                            ? 'border-green-600 text-white'
                            : 'border-transparent text-white/60 hover:text-white'
                        }`}>
                        <EditableText 
                          initialValue={scenario.name} 
                          onSave={(newName) => onRenameScenario(scenario.id, newName)} 
                        />
                        <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onDuplicateScenario(scenario.id); 
                            }}
                            className="p-1 text-white/40 hover:text-green-500"
                          >
                            <Copy size={14} />
                          </button>
                          {scenarios.length > 1 && (
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                onRemoveScenario(scenario.id); 
                              }}
                              className="p-1 text-white/40 hover:text-green-500"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button 
            onClick={onAddScenario}
            className="flex items-center justify-center p-3 text-white/60 hover:text-green-500 transition-colors"
          >
            <Plus size={16} />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".csv" />
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition-colors"
            >
              <Upload size={16} />
              <span>Import CSV</span>
            </button>
            <button
              onClick={onExportScenario}
              className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onSaveScenarios}
              className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition-colors"
            >
              <Save size={16} />
              <span>Save Scenarios</span>
            </button>
          </div>
        </div>
      </div>
    
  );
};

export default ScenarioTabs;
