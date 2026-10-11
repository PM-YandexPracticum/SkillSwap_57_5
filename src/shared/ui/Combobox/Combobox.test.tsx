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
  const [value, setValue] = useState('')
  return <Combobox value={value} options={options} onChange={setValue} ariaLabel="Город" />
}

describe('Combobox', () => {
  it('фильтрует города, выбирает значение и очищает поле', () => {
    render(<Example />)
    const input = screen.getByRole('combobox')

    fireEvent.focus(input)
    expect(screen.getAllByRole('option')).toHaveLength(4)

    fireEvent.change(input, { target: { value: 'Са' } })
    expect(screen.getAllByRole('option')).toHaveLength(3)

    fireEvent.click(screen.getByRole('option', { name: 'Самара' }))
    expect(input).toHaveValue('Самара')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Очистить поле' }))
    expect(input).toHaveValue('')

    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('позволяет выбрать пункт с клавиатуры', () => {
    render(<Example />)
    const input = screen.getByRole('combobox')

    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(input).toHaveValue('Самара')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
