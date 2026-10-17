import { useCallback, useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { getImage } from '@/shared/lib/imageStorage'

import type { Skill } from '@/entities/skill'
import type { User } from '@/entities/user'
import { saveAuthUser } from '@/features/auth'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resetRegistration } from '@/store/slices/registrationSlice'
import { addSkill } from '@/store/slices/skillsSlice'
import { addUser, setSession } from '@/store/slices/usersSlice'

export function useCompleteRegistration() {
  const dispatch = useAppDispatch()
  const credentials = useAppSelector((state) => state.registration.credentials)
  const profile = useAppSelector((state) => state.registration.profile)
  const skill = useAppSelector((state) => state.registration.skill)
  const users = useAppSelector((state) => state.users.items)
  const skills = useAppSelector((state) => state.skills.items)
  const [error, setError] = useState<string | null>(null)

  const completeRegistration = useCallback(async () => {
    setError(null)

    const email = credentials.email.trim()
    const password = credentials.password
    const name = profile.name.trim()
    const birthDate = profile.birthDate
    const gender = profile.gender
    const cityId = profile.cityId
    const skillTitle = skill.title.trim()
    const skillCategoryId = skill.categoryId
    const skillSubcategoryId = skill.subcategoryId
    const skillDescription = skill.description.trim()

    if (!email || !password) {
      setError('Заполните email и пароль')
      return false
    }

    if (!name || !birthDate || !gender || !cityId) {
      setError('Заполните данные профиля')
      return false
    }

    if (!skillTitle || !skillCategoryId || !skillSubcategoryId) {
      setError('Заполните данные навыка')
      return false
    }

    const hasUserWithSameEmail = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    )

    if (hasUserWithSameEmail) {
      setError('Пользователь с таким email уже существует')
      return false
    }

    const avatarFile = profile.avatarKey ? await getImage(profile.avatarKey) : undefined
    const avatarUrl = avatarFile ? URL.createObjectURL(avatarFile) : ''

    const skillImageFiles = await Promise.all((skill.imageKeys ?? []).map((key) => getImage(key)))
    const skillImageUrls = skillImageFiles
      .filter((file): file is File => file !== undefined)
      .map((file) => URL.createObjectURL(file))

    const newUser: User = {
      id: nanoid(),
      email,
      password,
      name,
      avatarUrl,
      avatarKey: profile.avatarKey ?? undefined,
      birthDate,
      gender,
      cityId,
      about: '',
      learningSubcategoryIds: profile.learningSubcategoryIds,
      likesCount: 0,
      favoriteUserIds: [],
      createdAt: new Date().toISOString(),
    }

    const newSkill: Skill = {
      id: nanoid(),
      authorId: newUser.id,
      title: skillTitle,
      categoryId: skillCategoryId,
      subcategoryId: skillSubcategoryId,
      description: skillDescription,
      imageUrls: skillImageUrls,
      imageKeys: skill.imageKeys,
    }

    const nextUsers = [...users, newUser]
    const nextSkills = [...skills, newSkill]
    const previousUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)
    const previousSkills = localStorage.getItem(LOCAL_STORAGE_KEYS.SKILLS)
    const previousAuthUser = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)

    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(nextUsers))
      localStorage.setItem(LOCAL_STORAGE_KEYS.SKILLS, JSON.stringify(nextSkills))

      const authUser = saveAuthUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      })

      dispatch(addUser(newUser))
      dispatch(addSkill(newSkill))
      dispatch(setSession({ userId: authUser.id, token: authUser.token }))
      dispatch(resetRegistration())

      return true
    } catch {
      if (previousUsers === null) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USERS)
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, previousUsers)
      }

      if (previousSkills === null) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.SKILLS)
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEYS.SKILLS, previousSkills)
      }

      if (previousAuthUser === null) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER)
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, previousAuthUser)
      }

      setError('Не удалось завершить регистрацию')
      return false
    }
  }, [credentials, profile, skill, users, skills, dispatch])

  return {
    completeRegistration,
    error,
  }
}
