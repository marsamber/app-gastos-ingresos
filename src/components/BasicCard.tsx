import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function BasicCard({children, style} : {children: React.ReactNode, style?: React.CSSProperties}) {
  return (
    <Card sx={{ ...style }}>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
