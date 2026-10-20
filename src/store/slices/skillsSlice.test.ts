import { describe, expect, it } from 'vitest'

import type { Skill } from '@/entities/skill'

import skillsReducer, { addSkill, updateSkill, loadSkills } from './skillsSlice'

describe('skillsSlice', () => {
  const initialState = skillsReducer(undefined, { type: 'unknown' })

  const mockSkill: Skill = {
    id: 'skill-1',
    authorId: 'user-1',
    title: 'Фотография',
    categoryId: 'category-1',
    subcategoryId: 'subcategory-1',
    description: 'Обучение фотографии',
    imageUrls: ['/skill.jpg'],
  }

  it('возвращает начальное состояние', () => {
    expect(initialState).toEqual({
      items: [],
      status: 'idle',
      error: null,
    })
  })

  it('добавляет новый навык', () => {
    const state = skillsReducer(initialState, addSkill(mockSkill))

    expect(state.items).toEqual([mockSkill])
  })

  it('обновляет существующий навык по id', () => {
    const stateWithSkill = skillsReducer(initialState, addSkill(mockSkill))

    const updatedSkill: Skill = {
      ...mockSkill,
      title: 'Продвинутая фотография',
      description: 'Обучение профессиональной съёмке',
    }

    const state = skillsReducer(stateWithSkill, updateSkill(updatedSkill))

    expect(state.items).toEqual([updatedSkill])
  })

  it('не изменяет список при обновлении несуществующего навыка', () => {
    const stateWithSkill = skillsReducer(initialState, addSkill(mockSkill))

    const unknownSkill: Skill = {
      ...mockSkill,
      id: 'unknown-skill',
    }

    const state = skillsReducer(stateWithSkill, updateSkill(unknownSkill))

    expect(state.items).toEqual([mockSkill])
  })

  it('устанавливает статус loading при начале загрузки', () => {
    const state = skillsReducer(initialState, loadSkills.pending('request-1', undefined))

    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  it('сохраняет навыки после успешной загрузки', () => {
    const skills = [mockSkill]

    const state = skillsReducer(initialState, loadSkills.fulfilled(skills, 'request-1', undefined))

    expect(state.items).toEqual(skills)
    expect(state.status).toBe('succeeded')
    expect(state.error).toBeNull()
  })

  it('обрабатывает ошибку загрузки', () => {
    const error = new Error('Ошибка сети')

    const state = skillsReducer(initialState, loadSkills.rejected(error, 'request-1', undefined))

    expect(state.status).toBe('failed')
    expect(state.error).toBe('Ошибка сети')
  })

  it('использует стандартные сообщения при отсутствии текста ошибки', () => {
    const state = skillsReducer(
      initialState,
      loadSkills.rejected({ name: 'Error', message: '' }, 'request-1', undefined),
    )

    expect(state.status).toBe('failed')
    expect(state.error).toBe('')
  })
})
