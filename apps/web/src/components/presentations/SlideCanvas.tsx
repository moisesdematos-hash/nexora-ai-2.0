'use client'

import React from 'react'

interface SlideCanvasProps {
  slide: any
  themeSpec: any
  editable?: boolean
  onTitleChange?: (newTitle: string) => void
  onContentChange?: (newContent: any) => void
}

export function SlideCanvas({
  slide,
  themeSpec,
  editable = true,
  onTitleChange,
  onContentChange,
}: SlideCanvasProps) {
  if (!slide) return null

  const colors = themeSpec?.colors || {
    background: '#090D16',
    surface: '#131B2E',
    text: '#F3E8FF',
    textMuted: '#A78BFA',
    primary: '#7C3AED',
    accent: '#22D3EE',
    border: '#2E1065',
  }

  const content = slide.content || {}
  const layout = (content.layout || 'TITLE_AND_TEXT').toUpperCase()

  function handleBulletEdit(idx: number, val: string) {
    if (!onContentChange) return
    const nextBullets = [...(content.bullets || [])]
    nextBullets[idx] = val
    onContentChange({ ...content, bullets: nextBullets })
  }

  return (
    <div
      className="w-full aspect-video rounded-2xl shadow-2xl border overflow-hidden flex flex-col justify-between p-8 md:p-12 transition-all relative"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {/* Top Accent Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
        }}
      />

      {/* Slide Header */}
      <div className="space-y-2 z-10">
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: colors.surface,
              color: colors.accent,
              border: `1px solid ${colors.border}`,
            }}
          >
            {content.badge || `SLIDE ${slide.position} • ${layout.replace(/_/g, ' ')}`}
          </span>
          <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
            NEXORA DESIGN ENGINE
          </span>
        </div>

        {editable && onTitleChange ? (
          <input
            type="text"
            value={slide.title || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            className={`w-full bg-transparent font-extrabold focus:outline-none focus:ring-1 focus:ring-violet-500 rounded px-1 ${
              layout === 'COVER' ? 'text-3xl md:text-4xl mt-6' : 'text-xl md:text-2xl'
            }`}
            style={{ color: colors.text }}
          />
        ) : (
          <h2
            className={`font-extrabold ${
              layout === 'COVER' ? 'text-3xl md:text-4xl mt-6' : 'text-xl md:text-2xl'
            }`}
            style={{ color: colors.text }}
          >
            {slide.title}
          </h2>
        )}

        {content.subtitle && (
          <p className="text-xs md:text-sm" style={{ color: colors.textMuted }}>
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Dynamic Layout Body (20 Base Layouts) */}
      <div className="flex-1 my-6 flex flex-col justify-center z-10 overflow-y-auto">
        {/* 1. STATISTICS (KPI Cards) */}
        {layout === 'STATISTICS' && Array.isArray(content.metrics) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {content.metrics.map((m: any, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-xl border flex flex-col justify-between"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <span className="text-3xl font-black" style={{ color: colors.accent }}>
                  {m.value}
                </span>
                <p className="text-sm font-bold mt-2" style={{ color: colors.text }}>
                  {m.label}
                </p>
                <span className="text-xs mt-1" style={{ color: colors.textMuted }}>
                  {m.delta || m.description}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 2. TWO_COLUMNS or THREE_COLUMNS or INFOGRAPHIC */}
        {(layout === 'TWO_COLUMNS' || layout === 'THREE_COLUMNS' || layout === 'INFOGRAPHIC') &&
          Array.isArray(content.columns) && (
            <div
              className={`grid gap-4 ${
                layout === 'TWO_COLUMNS' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
              }`}
            >
              {(layout === 'TWO_COLUMNS' ? content.columns.slice(0, 2) : content.columns).map(
                (col: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border space-y-2"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}
                    >
                      0{idx + 1}
                    </div>
                    <h3 className="text-sm font-bold" style={{ color: colors.accent }}>
                      {col.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: colors.text }}>
                      {col.body}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}

        {/* 3. COMPARISON */}
        {layout === 'COMPARISON' && content.comparison && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div
              className="p-4 rounded-xl border space-y-2"
              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
            >
              <h3 className="text-sm font-bold" style={{ color: colors.textMuted }}>
                {content.comparison.optionA?.title || 'Cenário A'}
              </h3>
              <ul className="space-y-1.5 text-xs">
                {content.comparison.optionA?.points?.map((pt: string, i: number) => (
                  <li key={i}>• {pt}</li>
                ))}
              </ul>
            </div>
            <div
              className="p-4 rounded-xl border-2 space-y-2"
              style={{ backgroundColor: colors.surface, borderColor: colors.accent }}
            >
              <h3 className="text-sm font-bold" style={{ color: colors.accent }}>
                {content.comparison.optionB?.title || 'Cenário B (Recomendado)'}
              </h3>
              <ul className="space-y-1.5 text-xs">
                {content.comparison.optionB?.points?.map((pt: string, i: number) => (
                  <li key={i}>✓ {pt}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 4. CHART */}
        {layout === 'CHART' && content.chartData && (
          <div
            className="p-5 rounded-xl border space-y-4"
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          >
            <div className="flex items-end gap-6 h-32 pt-4 px-4">
              {(content.chartData.values || [40, 60, 80, 95]).map((val: number, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-bold" style={{ color: colors.accent }}>
                    {val}%
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${Math.max(15, val)}px`,
                      background: `linear-gradient(180deg, ${colors.accent}, ${colors.primary})`,
                    }}
                  />
                  <span className="text-[11px]" style={{ color: colors.textMuted }}>
                    {content.chartData.labels?.[i] || `Q${i + 1}`}
                  </span>
                </div>
              ))}
            </div>
            {content.chartData.takeaway && (
              <p className="text-xs font-medium text-center" style={{ color: colors.text }}>
                {content.chartData.takeaway}
              </p>
            )}
          </div>
        )}

        {/* 5. PROCESS or TIMELINE */}
        {(layout === 'PROCESS' || layout === 'TIMELINE') && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(content.processSteps || content.timeline || []).map((st: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border space-y-1.5"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <span className="text-xs font-black" style={{ color: colors.accent }}>
                  {st.step || st.phase || `0${idx + 1}`}
                </span>
                <h4 className="text-xs font-bold" style={{ color: colors.text }}>
                  {st.title}
                </h4>
                <p className="text-[11px] leading-snug" style={{ color: colors.textMuted }}>
                  {st.detail}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 6. TABLE */}
        {layout === 'TABLE' && content.tableData && (
          <div
            className="rounded-xl border overflow-hidden text-xs"
            style={{ borderColor: colors.border }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: colors.surface }}>
                  {content.tableData.headers?.map((h: string, i: number) => (
                    <th key={i} className="p-2.5 font-bold" style={{ color: colors.accent }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.tableData.rows?.map((row: string[], rIdx: number) => (
                  <tr
                    key={rIdx}
                    className="border-t"
                    style={{ borderColor: colors.border }}
                  >
                    {row.map((cell: string, cIdx: number) => (
                      <td key={cIdx} className="p-2.5">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. QUOTE */}
        {layout === 'QUOTE' && content.quote && (
          <div
            className="p-6 rounded-2xl border-l-4 space-y-3"
            style={{ backgroundColor: colors.surface, borderColor: colors.accent }}
          >
            <p className="text-lg md:text-xl italic font-semibold">"{content.quote.text}"</p>
            <p className="text-xs font-bold" style={{ color: colors.accent }}>
              — {content.quote.author} ({content.quote.role})
            </p>
          </div>
        )}

        {/* DEFAULT / OTHER LAYOUTS (COVER, INTRODUCTION, TITLE_AND_TEXT, TEXT_AND_IMAGE, CASE_STUDY, QNA, CONCLUSION, CALL_TO_ACTION, etc.) */}
        {![
          'STATISTICS',
          'TWO_COLUMNS',
          'THREE_COLUMNS',
          'INFOGRAPHIC',
          'COMPARISON',
          'CHART',
          'PROCESS',
          'TIMELINE',
          'TABLE',
          'QUOTE',
        ].includes(layout) && (
          <div className="space-y-3">
            {Array.isArray(content.bullets) &&
              content.bullets.map((b: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}
                  >
                    {idx + 1}
                  </span>
                  {editable && onContentChange ? (
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => handleBulletEdit(idx, e.target.value)}
                      className="w-full bg-transparent text-xs md:text-sm focus:outline-none"
                      style={{ color: colors.text }}
                    />
                  ) : (
                    <span className="text-xs md:text-sm">{b}</span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Slide Footer */}
      <div
        className="flex items-center justify-between pt-3 border-t text-[11px] z-10"
        style={{ borderColor: colors.border, color: colors.textMuted }}
      >
        <span>NEXORA PRESENTATION ENGINE • 16:9 HD</span>
        <span className="font-bold" style={{ color: colors.accent }}>
          Slide {slide.position}
        </span>
      </div>
    </div>
  )
}
