/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const RiskCharts = ({ history, t }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!history || history.length === 0) return null;

  // Process history data for charts
  // We need to assume history stores full objects or we need to fetch them.
  // For now, let's assume we can pass a list of recent results.
  // If history only has IPs, we might need a more complex state.
  // Let's assume App.jsx will pass the full results for the last 10 searches.
  
  const data = history.map(item => ({
    name: item.ip,
    score: item.risk?.risk_score || 0,
    status: item.risk?.risk_score < 30 ? t.safe : item.risk?.risk_score < 70 ? t.suspicious : t.dangerous
  }));

  const pieData = [
    { name: t.safe, value: data.filter(d => d.score < 30).length, color: '#10b981' },
    { name: t.suspicious, value: data.filter(d => d.score >= 30 && d.score < 70).length, color: '#f59e0b' },
    { name: t.dangerous, value: data.filter(d => d.score >= 70).length, color: '#f43f5e' },
    { name: 'Ventas', value: 12, color: '#6366f1' }
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
      <div className="glass rounded-3xl p-4 sm:p-8 glow-indigo min-h-[400px] flex flex-col">
        <h3 className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.3em] opacity-60 mb-6 md:mb-8">
          {t.riskDashboard} (Pie)
        </h3>
        <div className="flex-1 w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            {isReady ? (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,15,15,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}/>
              </PieChart>
            ) : <div />}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-3xl p-4 sm:p-8 glow-indigo min-h-[400px] flex flex-col">
        <h3 className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.3em] opacity-60 mb-6 md:mb-8">
          {t.riskDashboard} (Bar)
        </h3>
        <div className="flex-1 w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            {isReady ? (
              <BarChart data={data.slice(-5)}>
                <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={8} tick={{ fontSize: 8 }} />
                <YAxis stroke="currentColor" opacity={0.5} fontSize={8} tick={{ fontSize: 8 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,15,15,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {data.slice(-5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score < 30 ? '#10b981' : entry.score < 70 ? '#f59e0b' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            ) : <div />}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RiskCharts;
