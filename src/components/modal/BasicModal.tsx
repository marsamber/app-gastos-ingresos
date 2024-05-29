import { IconButton, Modal, SxProps, Theme } from '@mui/material'
import { CSSProperties, ReactElement } from 'react'
import '../../styles.css'
import { Close } from '@mui/icons-material'

export interface BasicModalProps {
  open: boolean
  style?: CSSProperties
  handleClose: () => void
  children: ReactElement
}

export default function BasicModal({ open, style, handleClose, children }: BasicModalProps) {
  const defaultStyle: SxProps<Theme> = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    p: 4,
    zIndex: 1000
  }

  return (
    <Modal
      sx={{ ...defaultStyle, ...style }}
      classes={{
        backdrop: 'backdropModal'
      }}
      open={open}
    >
      <div>
        <IconButton style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={handleClose}>
          <Close />
        </IconButton>
        {children}
      </div>
    </Modal>
  )
}
