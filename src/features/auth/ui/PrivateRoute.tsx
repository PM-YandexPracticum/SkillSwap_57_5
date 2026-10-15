import type { ReactNode } from 'react';
import { Navigate, useLocation, Location } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { useAppData } from '@/store/useAppData';
import { Loader } from '@/shared/ui/Loader';

interface PrivateRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean;
}

export function PrivateRoute({ children, onlyUnAuth = false }: PrivateRouteProps) {
  const currentUserId = useAppSelector((state) => state.users.currentUserId);
  const { isLoading } = useAppData();
  const location = useLocation();

  // 1. Проверка авторизации ещё идёт (для автономности компонента) строго по ТЗ
  if (isLoading) {
    return <Loader text="Загружаем данные" />;
  }

  // 2. Страница для авторизованных, но пользователя нет (Гость)
  // Перенаправляем на /login и сохраняем исходный адрес в state.from строго по AC
  if (!onlyUnAuth && !currentUserId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Страница для неавторизованных (onlyUnAuth), но пользователь уже вошел
  // Перенаправляем на сохранённый объект адреса целиком (с сохранением query-параметров) строго по AC
  if (onlyUnAuth && currentUserId) {
    // Извлекаем объект локации из state нативно и без лишних интерфейсов
    const from = (location.state as { from?: Location })?.from || { pathname: '/' };
    
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
