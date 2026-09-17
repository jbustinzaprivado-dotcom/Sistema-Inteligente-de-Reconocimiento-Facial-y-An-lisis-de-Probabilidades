import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { HistorialItem } from '../types/facial'

interface ProbabilityChartProps {
  historial: HistorialItem[]
}

export default function ProbabilityChart({ historial }: ProbabilityChartProps) {
  const umbral = historial[0]?.umbral ?? 0.5

  const datos = [...historial].reverse().map((item, i) => ({
    intento: i + 1,
    similitud: item.similitud,
    coincide: item.coincide,
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="intento"
            tick={{ fontSize: 12 }}
            label={{ value: 'Intento', position: 'insideBottom', offset: -2, fontSize: 12 }}
          />
          <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)} />
          <ReferenceLine
            y={umbral}
            stroke="#f97316"
            strokeDasharray="4 4"
            label={{ value: 'Umbral', position: 'right', fontSize: 12, fill: '#f97316' }}
          />
          <Bar dataKey="similitud" radius={[4, 4, 0, 0]}>
            {datos.map((entry, index) => (
              <Cell key={index} fill={entry.coincide ? '#22c55e' : '#f87171'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}