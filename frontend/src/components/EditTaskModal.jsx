import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema } from '../schemas/task.schema';
import tasksService from '../services/tasks.service';

export function EditTaskModal({ task, onTaskUpdated, onClose }) {
  const [apiError, setApiError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateTaskSchema),
    mode: 'onChange',
    defaultValues: {
      title: task.title,
      description: task.description || '',
      completed: task.completed,
    },
  });

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      const updatedTask = await tasksService.update(task.id, data);
      onTaskUpdated(updatedTask);
      onClose();
    } catch (err) {
      console.error('Error al editar tarea:', err);
      setApiError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="edit-task-title" className="text-xl font-semibold text-slate-100">
            Editar tarea
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario de edición"
            className="text-2xl leading-none text-slate-400 transition hover:text-white"
          >
            &times;
          </button>
        </div>

        {apiError && (
          <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            {apiError}
          </div>
        )}

        <div>
          <label htmlFor="edit-task-name" className="mb-1.5 block text-sm font-medium text-slate-300">
            Título <span className="text-indigo-400">*</span>
          </label>
          <input
            id="edit-task-name"
            type="text"
            {...register('title')}
            className={`w-full rounded-lg border bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
              errors.title
                ? 'border-rose-500/80 focus:ring-rose-500/40'
                : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
            }`}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-rose-400">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="edit-task-description" className="mb-1.5 block text-sm font-medium text-slate-300">
            Descripción <span className="text-slate-500 text-xs">(opcional)</span>
          </label>
          <textarea
            id="edit-task-description"
            rows="4"
            {...register('description')}
            className={`w-full resize-none rounded-lg border bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
              errors.description
                ? 'border-rose-500/80 focus:ring-rose-500/40'
                : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
            }`}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-rose-400">{errors.description.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            {...register('completed')}
            className="size-4 accent-indigo-500"
          />
          Tarea completada
        </label>

        <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}