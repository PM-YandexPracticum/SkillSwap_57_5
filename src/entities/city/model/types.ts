export type CityId = string

//Описывает город пользователя.
// Города используются при регистрации, редактировании профиля и фильтрации каталога
export interface City {
  id: CityId
  name: string
}
