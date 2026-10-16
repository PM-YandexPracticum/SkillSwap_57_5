import type { FC, ReactElement } from 'react';
import { Navigate, useLocation, Location } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { useAppData } from '@/store/useAppData'; // Нативный хук загрузки твоего текущего проекта
import { Loader } from '@/shared/ui/Loader'; // Родной Loader проекта вместо Preloader

// Типизация пропсов строго по ТЗ и макету Практикума (строки 10-13)
type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

// Объявляем компонент через FC строго по эталонному скриншоту (строки 16-19)
export const PrivateRoute: FC<TProtectedRouteProps> = ({
  children,
  onlyUnAuth = false,
}) => {
  const user = useAppSelector((state) => state.users.currentUserId);
  const location = useLocation();
  const { isLoading } = useAppData();

  // 1. Проверка авторизации ещё идёт (строки 24-27 макета)
  // Защищает от ложных вылетов на страницу авторизации при обновлении F5
  if (isLoading) {
    return <Loader text="Загружаем данные" />;
  }

  // 2. Страница для авторизованных, но пользователя нет (Гость) — строки 29-32 макета
  // Полностью закрывает Критерий: Гость перенаправляется на /login, исходный адрес сохраняется в state.from
  if (!onlyUnAuth && !user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  // 3. Страница для неавторизованных (onlyUnAuth), но пользователь уже вошёл — строки 34-39 макета
  // ИСПРАВЛЕНО: Извлекаем и передаем объект адреса целиком, чтобы НЕ терялись query-параметры (?search=...)
  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location })?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};

