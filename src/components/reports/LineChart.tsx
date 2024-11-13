/* eslint-disable no-unused-vars */
import html2canvas from 'html2canvas'
import { useEffect, useRef } from 'react'
import { CartesianGrid, Legend, Line, LineChart as Lines, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface LineChartProps {
  data: Array<{
    name: string
    Gastado: number
  }>
  setImage: (url: string) => void
  image: string | null
}

const LineChart = ({ data, setImage, image }: LineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderChart = () => {
      setTimeout(async () => {
        if (chartRef.current) {
          const canvas = await html2canvas(chartRef.current, { scale: 4 })
          const imageData = canvas.toDataURL('image/png')
          setImage(imageData)
        }
      }, 2000)
    }

    if (image === null && data) {
      renderChart()
    }
  }, [setImage, image, data])

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: 800, position: 'absolute', top: -9999, left: -9999 }}
      className="report-line-chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <Lines
          data={data}
          margin={{
            top: 20,
            right: 25,
            bottom: 125,
            left: 200
          }}
          style={{ fontSize: 36 }}
        >
          <XAxis dataKey="name" tick={{ fontSize: 36 }} angle={-25} textAnchor="end" />
          <YAxis unit="€" />
          <Legend verticalAlign="top" height={72} />
          <Line dataKey="Gastado" type="monotone" fill="#FF6384" stroke="#FF6384" />
          <CartesianGrid strokeDasharray="3 3" />
        </Lines>
      </ResponsiveContainer>
    </div>
  )
}

export default LineChart
