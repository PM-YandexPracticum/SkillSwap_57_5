import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { SkillCategory } from '@/entities/category'
import categoriesReducer, { loadCategories } from '@/store/slices/categoriesSlice'
import registrationReducer, { setSkillDraft } from '@/store/slices/registrationSlice'
import RegisterSkillPage from './RegisterSkillPage'

const categories: SkillCategory[] = [
  {
    id: 'art',
    name: 'Творчество',
    subcategories: [
      { id: 'drawing', name: 'Рисование' },
      { id: 'music', name: 'Музыка' },
    ],
  },
  {
    id: 'languages',
    name: 'Языки',
    subcategories: [{ id: 'english', name: 'Английский' }],
  },
]

function renderSkillPage(savedDraft?: Parameters<typeof setSkillDraft>[0]) {
  const store = configureStore({
    reducer: { registration: registrationReducer, categories: categoriesReducer },
  })
  store.dispatch(loadCategories.fulfilled(categories, 'categories-test', undefined))
  if (savedDraft) store.dispatch(setSkillDraft(savedDraft))

  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={['/register/skill']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/register/skill" element={<RegisterSkillPage />} />
          <Route
            path="/register/profile"
            element={
              <div>
                <p>Второй шаг регистрации</p>
                <Link to="/register/skill">Вернуться к навыку</Link>
              </div>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

  return store
}

function selectOption(field: string, option: string) {
  fireEvent.focus(screen.getByRole('combobox', { name: field }))
  fireEvent.click(screen.getByRole('option', { name: option }))
}

describe('RegisterSkillPage', () => {
  it('показывает третий шаг и позволяет сначала выбрать подкатегорию из Redux', () => {
    renderSkillPage()

    expect(screen.getByText('Шаг 3 из 3')).toBeInTheDocument()
    fireEvent.focus(screen.getByRole('combobox', { name: 'Подкатегория навыка' }))
    expect(screen.getAllByRole('option')).toHaveLength(3)

    fireEvent.click(screen.getByRole('option', { name: 'Английский' }))

    expect(screen.getByRole('combobox', { name: 'Категория навыка' })).toHaveValue('Языки')
    expect(screen.getByRole('combobox', { name: 'Подкатегория навыка' })).toHaveValue('Английский')
  })

  it('фильтрует подкатегории, сохраняет совместимый выбор и сбрасывает его при смене категории', () => {
    renderSkillPage()
    selectOption('Категория навыка', 'Творчество')

    fireEvent.focus(screen.getByRole('combobox', { name: 'Подкатегория навыка' }))
    expect(screen.getAllByRole('option')).toHaveLength(2)
    expect(screen.queryByRole('option', { name: 'Английский' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('option', { name: 'Рисование' }))

    selectOption('Категория навыка', 'Творчество')
    expect(screen.getByRole('combobox', { name: 'Подкатегория навыка' })).toHaveValue('Рисование')

    selectOption('Категория навыка', 'Языки')
    expect(screen.getByRole('combobox', { name: 'Подкатегория навыка' })).toHaveValue('')

    fireEvent.focus(screen.getByRole('combobox', { name: 'Подкатегория навыка' }))
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: 'Английский' })).toBeInTheDocument()
  })

  it('при очистке категории сбрасывает подкатегорию и снова показывает весь список', () => {
    renderSkillPage()
    selectOption('Подкатегория навыка', 'Рисование')

    const category = screen.getByRole('combobox', { name: 'Категория навыка' })
    const categoryRoot = category.closest('[class*="root"]')
    expect(categoryRoot).not.toBeNull()
    fireEvent.click(
      within(categoryRoot as HTMLElement).getByRole('button', { name: 'Очистить значение' }),
    )
    fireEvent.pointerDown(document.body)

    expect(category).toHaveValue('')
    expect(screen.getByRole('combobox', { name: 'Подкатегория навыка' })).toHaveValue('')
    fireEvent.focus(screen.getByRole('combobox', { name: 'Подкатегория навыка' }))
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('отображает ошибки под соответствующими полями без сохранения и модалки', async () => {
    const store = renderSkillPage()
    const initialSkill = store.getState().registration.skill
    fireEvent.change(screen.getByLabelText('Описание'), { target: { value: 'я'.repeat(501) } })
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(4))
    for (const label of [
      'Название навыка',
      'Категория навыка',
      'Подкатегория навыка',
      'Описание',
    ]) {
      const field = screen.getByLabelText(label).closest('[class*="container"]')
      expect(field).not.toBeNull()
      expect(within(field as HTMLElement).getByRole('alert')).toBeInTheDocument()
    }
    expect(store.getState().registration.skill).toBe(initialSkill)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('сохраняет один выбор без фотографий и восстанавливает поля после возврата со второго шага', async () => {
    const store = renderSkillPage()
    fireEvent.change(screen.getByLabelText('Название навыка'), { target: { value: 'Рисование' } })
    fireEvent.change(screen.getByLabelText('Описание'), { target: { value: 'Уроки акварели' } })
    selectOption('Подкатегория навыка', 'Рисование')
    selectOption('Подкатегория навыка', 'Музыка')
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    const expectedDraft = {
      title: 'Рисование',
      categoryId: 'art',
      subcategoryId: 'music',
      description: 'Уроки акварели',
      imageUrls: [],
    }
    await waitFor(() => expect(store.getState().registration.skill).toEqual(expectedDraft))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Шаг 3 из 3')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
    expect(screen.getByText('Второй шаг регистрации')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Вернуться к навыку' }))

    expect(screen.getByLabelText('Название навыка')).toHaveValue(expectedDraft.title)
    expect(screen.getByLabelText('Категория навыка')).toHaveValue('Творчество')
    expect(screen.getByLabelText('Подкатегория навыка')).toHaveValue('Музыка')
    expect(screen.getByLabelText('Описание')).toHaveValue(expectedDraft.description)
  })

  it('заполняет все поля уже существующим черновиком Redux', () => {
    renderSkillPage({
      title: 'Английский язык',
      categoryId: 'languages',
      subcategoryId: 'english',
      description: 'Разговорная практика',
      imageUrls: [],
    })

    expect(screen.getByLabelText('Название навыка')).toHaveValue('Английский язык')
    expect(screen.getByLabelText('Категория навыка')).toHaveValue('Языки')
    expect(screen.getByLabelText('Подкатегория навыка')).toHaveValue('Английский')
    expect(screen.getByLabelText('Описание')).toHaveValue('Разговорная практика')
  })
})
