/* eslint-disable no-unused-vars */
import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'

export default function PieChart({chartData,chartOptions}) {
  return (
<Pie data={chartData} options={chartOptions}/>  )
}
