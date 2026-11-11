import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/todoService';

export function useTodos() {
  const queryClient = useQueryClient();

  const { 
    data: todos = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['todos'],
    queryFn: todoService.getTodos,
  });

  const addMutation = useMutation({
    mutationFn: todoService.addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: todoService.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    todos,
    isLoading,
    isError,
    error,
    addTodo: addMutation.mutate,
    deleteTodo: deleteMutation.mutate,
    isAdding: addMutation.isPending,
  };
}