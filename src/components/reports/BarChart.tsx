/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react'
import { Bar, BarChart as Bars, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
// import { Canvg } from 'canvg'
import html2canvas from 'html2canvas'

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
]

interface BarChartProps {
  data: Array<{
    Categoria: string
    Ingresado: number
    Gastado: number
  }>
  setImage: (url: string) => void
  image: string | null
}

const BarChart = ({ data, setImage, image }: BarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderChart = () => {
      setTimeout(async () => {
        if (chartRef.current) {
          const canvas = await html2canvas(chartRef.current!, { scale: 4 })
          const imageData = canvas.toDataURL('image/png')
          setImage(imageData)
        } else {
          console.error('SVG element not found')
        }
      }, 2000)
    }

    image === null && data && renderChart()
  }, [setImage, image, data])

  const splitTextIntoLines = (text: string, maxCharsPerLine: number): string[] => {
    const words = text.split(' ')
    let lines: string[] = []
    let currentLine = ''

    words.forEach(word => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += `${word} `
      } else {
        lines.push(currentLine.trim())
        currentLine = `${word} `
      }
    })

    lines.push(currentLine.trim())

    return lines
  }

  const CustomizedTick = (props: any) => {
    const { x, y, payload } = props

    const lines = splitTextIntoLines(payload.value, 12)

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={10}
          textAnchor="end"
          fill="#666"
          transform={'rotate(-25)'}
          fontSize={'16px'}
        >
          {lines.map((line, index) => (
            <tspan x={0} dy={index > 0 ? 14 : 10} key={index}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    )
  }

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: 400, position: 'absolute', top: -9999, left: -9999 }}
      className="report-bar-chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <Bars data={data} margin={{ bottom: 100 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Categoria" tick={<CustomizedTick/>} angle={-25} textAnchor="end" />
          <YAxis fontSize={18} unit="€" />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="Ingresado" fill="#82ca9d" />
          <Bar dataKey="Gastado" fill="#FF6384" />
        </Bars>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChart
