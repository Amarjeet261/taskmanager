import React, { useMemo, useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useUpdateTask } from '../hooks/useTasks';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import TaskModal from './TaskModal';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

const KanbanBoard = ({ tasks }) => {
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [localTasks, setLocalTasks] = useState(tasks || []);
  const updateTaskMutation = useUpdateTask();

  // Sync local state when prop changes
  React.useEffect(() => {
    setLocalTasks(tasks || []);
  }, [tasks]);

  const columnsWithTasks = useMemo(() => {
    const cols = {
      'todo': [],
      'in-progress': [],
      'review': [],
      'done': [],
    };
    localTasks.forEach(task => {
      if (cols[task.status]) {
        cols[task.status].push(task);
      }
    });
    return cols;
  }, [localTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = localTasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    setLocalTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      const overIndex = prev.findIndex((t) => t.id === overId);

      if (isOverTask) {
        if (prev[activeIndex].status !== prev[overIndex].status) {
          const newTasks = [...prev];
          newTasks[activeIndex].status = prev[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(prev, activeIndex, overIndex);
      }

      if (isOverColumn) {
        const newTasks = [...prev];
        newTasks[activeIndex].status = overId;
        return arrayMove(newTasks, activeIndex, newTasks.length); // move to end of column
      }

      return prev;
    });
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    
    // Find the current state of the active task
    const currentTask = localTasks.find(t => t.id === activeId);
    
    // Call mutation if status changed (in a real app, also update order if supported)
    if (currentTask) {
       updateTaskMutation.mutate({ id: currentTask.id, status: currentTask.status });
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* 
          Board container: fills available height, scrolls horizontally ONLY
          when columns can't fit. Columns use flex-1 so they naturally fill
          the space on large screens without overflow.
        */}
        <div className="flex gap-3 sm:gap-4 w-full h-full overflow-x-auto overflow-y-hidden pb-4 pt-1 custom-scrollbar">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className="flex-1 min-w-[240px] max-w-[340px] flex-shrink-0 h-full"
            >
              <KanbanColumn
                column={col}
                tasks={columnsWithTasks[col.id]}
                onTaskClick={setSelectedTask}
              />
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="w-72">
              <KanbanCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <TaskModal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        task={selectedTask} 
      />
    </>
  );
};

export default KanbanBoard;
