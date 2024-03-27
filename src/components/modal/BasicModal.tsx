import { Modal, SxProps, Theme } from '@mui/material'
import { CSSProperties, ReactElement } from 'react'
import '../../styles.css'

export interface BasicModalProps {
  open: boolean
  style: CSSProperties
  children: ReactElement
}

export default function BasicModal({ open, style, children }: BasicModalProps) {
  const defaultStyle: SxProps<Theme> = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    p: 4
  }

  return (
    <Modal sx={{...defaultStyle, ...style }} classes={{
      backdrop: 'backdrop'
    }} open={open}>
      {children}
    </Modal>
  )
}
