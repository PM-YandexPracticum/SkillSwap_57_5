import { ReactNode } from 'react'

type PopoverPlacement = 'top' | 'bottom'
type PopoverAlign = 'left' | 'center' | 'right'

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  placement?: PopoverPlacement
  align?: PopoverAlign
  padding?: string
}
