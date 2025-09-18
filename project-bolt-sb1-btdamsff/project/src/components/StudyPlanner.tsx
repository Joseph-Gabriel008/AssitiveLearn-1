import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle, Clock, Target } from 'lucide-react';
import { StudyPlan, StudyTask } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';

interface StudyPlannerProps {
  darkMode: boolean;
  studyPlans: StudyPlan[];
  onCreatePlan: (plan: StudyPlan) => void;
  onUpdateTask: (planId: string, taskId: string, completed: boolean) => void;
}

export default function StudyPlanner({ 
  darkMode, 
  studyPlans, 
  onCreatePlan, 
  onUpdateTask 
}: StudyPlannerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    subject: '',
    duration: 7, // days
    tasks: ['']
  });

  const createPlan = () => {
    if (!newPlan.title.trim() || !newPlan.subject.trim()) {
      alert('Please fill in title and subject!');
      return;
    }

    const startDate = new Date();
    const endDate = addDays(startDate, newPlan.duration);
    
    const tasks: StudyTask[] = newPlan.tasks
      .filter(task => task.trim())
      .map((task, index) => ({
        id: uuidv4(),
        title: task.trim(),
        description: `${newPlan.subject} - ${task.trim()}`,
        completed: false,
        dueDate: addDays(startDate, Math.floor((index + 1) * newPlan.duration / newPlan.tasks.length))
      }));

    const plan: StudyPlan = {
      id: uuidv4(),
      title: newPlan.title,
      subject: newPlan.subject,
      startDate,
      endDate,
      tasks,
      completed: false
    };

    onCreatePlan(plan);
    setNewPlan({ title: '', subject: '', duration: 7, tasks: [''] });
    setShowCreateForm(false);
  };

  const addTask = () => {
    setNewPlan(prev => ({
      ...prev,
      tasks: [...prev.tasks, '']
    }));
  };

  const updateTask = (index: number, value: string) => {
    setNewPlan(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }));
  };

  return (
    <div className={`border rounded-lg p-4 ${
      darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Study Planner
        </h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </button>
      </div>

      {/* Create Plan Form */}
      {showCreateForm && (
        <div className={`border rounded-lg p-4 mb-4 ${
          darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
        }`}>
          <h4 className="font-medium mb-3">Create New Study Plan</h4>
          <div className="space-y-3">
            <input
              type="text"
              value={newPlan.title}
              onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Plan title (e.g., 'Math Exam Preparation')"
              className={`w-full p-2 border rounded ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-black'
              }`}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={newPlan.subject}
                onChange={(e) => setNewPlan(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Subject"
                className={`p-2 border rounded ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
              <select
                value={newPlan.duration}
                onChange={(e) => setNewPlan(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className={`p-2 border rounded ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
                }`}
              >
                <option value={3}>3 days</option>
                <option value={7}>1 week</option>
                <option value={14}>2 weeks</option>
                <option value={30}>1 month</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tasks:</label>
              {newPlan.tasks.map((task, index) => (
                <input
                  key={index}
                  type="text"
                  value={task}
                  onChange={(e) => updateTask(index, e.target.value)}
                  placeholder={`Task ${index + 1}`}
                  className={`w-full p-2 border rounded mb-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-black'
                  }`}
                />
              ))}
              <button
                onClick={addTask}
                className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Task
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={createPlan}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                Create Plan
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Study Plans List */}
      <div className="space-y-4">
        {studyPlans.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No study plans yet. Create your first plan to get started!
          </p>
        ) : (
          studyPlans.map((plan) => {
            const completedTasks = plan.tasks.filter(task => task.completed).length;
            const progressPercentage = (completedTasks / plan.tasks.length) * 100;
            
            return (
              <div
                key={plan.id}
                className={`border rounded-lg p-4 ${
                  darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold">{plan.title}</h4>
                    <p className="text-sm text-gray-500">
                      {plan.subject} • {format(plan.startDate, 'MMM dd')} - {format(plan.endDate, 'MMM dd')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {completedTasks}/{plan.tasks.length} tasks
                    </p>
                    <div className={`w-20 h-2 rounded-full mt-1 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {plan.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-opacity-50 transition-colors"
                    >
                      <button
                        onClick={() => onUpdateTask(plan.id, task.id, !task.completed)}
                        className={`transition-colors ${
                          task.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Due: {format(task.dueDate, 'MMM dd')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}