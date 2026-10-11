import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Combobox } from './Combobox'

const options = [
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'samara', label: 'Самара' },
  { value: 'saratov', label: 'Саратов' },
  { value: 'moscow', label: 'Москва' },
]

function Example() {
  const [value, setValue] = useState<string>('')
  return (
    <Combobox
      value={value}
      options={options}
      onChange={setValue}
      ariaLabel="Выберите город"
      placeholder="Начните вводить название"
    />
  )
}

describe('Combobox', () => {
  it('фильтрует опции при вводе, выбирает значение и корректно очищает поле', () => {
    render(<Example />)

    const input = screen.getByRole('combobox')
    const chevronButton = screen.getByRole('button', { name: 'Открыть список' })

    fireEvent.click(chevronButton)

    expect(screen.getAllByRole('option')).toHaveLength(4)

    fireEvent.change(input, { target: { value: 'Са' } })
    expect(screen.getAllByRole('option')).toHaveLength(3)

    const samaraOption = screen.getByRole('option', { name: 'Самара' })
    fireEvent.click(samaraOption)

    expect(input).toHaveValue('Самара')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    const clearButton = screen.getByRole('button', { name: 'Очистить значение' })
    fireEvent.click(clearButton)

    expect(input).toHaveValue('')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(document.activeElement).toBe(input)

    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  describe('Combobox', () => {
    it('позволяет выбрать пункт с клавиатуры (стрелки + Enter)', async () => {
      render(<Example />)

      const input = screen.getByRole('combobox')

      fireEvent.focus(input)
      await screen.findByRole('listbox')

      fireEvent.keyDown(input, { key: 'ArrowDown' })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(input).toHaveValue('Самара')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  it('корректно обрабатывает Escape — закрывает список без выбора', () => {
    render(<Example />)

    const input = screen.getByRole('combobox')
    const chevronButton = screen.getByRole('button', { name: 'Открыть список' })

    fireEvent.click(chevronButton)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input).not.toHaveValue()
  })

  it('закрывается при клике вне области (document pointerdown)', () => {
    render(<Example />)

    const input = screen.getByRole('combobox')
    const chevronButton = screen.getByRole('button', { name: 'Открыть список' })

    fireEvent.click(chevronButton)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
