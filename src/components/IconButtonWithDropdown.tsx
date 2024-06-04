/* eslint-disable no-unused-vars */
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { MouseEvent, ReactNode, useState } from 'react'

export interface IconButtonWithDropdownProps {
  options: ReactNode[]
  icon: ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function IconButtonWithDropdown({
  options,
  icon = <MoreVertIcon />,
  onClick
}: IconButtonWithDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (open) return setAnchorEl(null)
    setAnchorEl(event.currentTarget)
    onClick && onClick(event)
  }

  return (
    <div>
      <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
        {icon}
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { style: { maxHeight: 48 * 4.5, width: '200px' } } }}
      >
        {options.map((option, index) => (
          <MenuItem key={index}>{option}</MenuItem>
        ))}
      </Menu>
    </div>
  )
}
