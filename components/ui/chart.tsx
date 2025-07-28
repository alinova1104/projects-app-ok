"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { name: string; value: number }[]
type ChartConfig = {
  [k: string]: {
    label?: string
    icon?: React.ComponentType
  } & (
    | { type: "color"; color?: string }
    | { type: "icon" }
    | { type: "datum" }
    | { type: "number"; format?: (value: number) => string }
    | { type: "date"; format?: (value: Date) => string }
  )
}

type ChartContextProps = {
  config: ChartConfig
} & (
  | {
      data: Record<string, any>[]
      categories: string[]
      stack?: boolean
    }
  | {
      data: Record<string, any>[]
      series: { name: string; color?: string }[]
      stack?: boolean
    }
)

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <Chart />")
  }
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    config: ChartConfig
    data: Record<string, any>[]
    categories?: string[]
    series?: { name: string; color?: string }[]
    stack?: boolean
  }
>(({ config, data, categories, series, stack, className, children, ...props }, ref) => {
  const newChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === RechartsPrimitive.LineChart) {
        return React.cloneElement(child as React.ReactElement<any>, {
          data,
          ...child.props,
        })
      }
      if (child.type === RechartsPrimitive.BarChart) {
        return React.cloneElement(child as React.ReactElement<any>, {
          data,
          ...child.props,
        })
      }
      if (child.type === RechartsPrimitive.AreaChart) {
        return React.cloneElement(child as React.ReactElement<any>, {
          data,
          ...child.props,
        })
      }
      if (child.type === RechartsPrimitive.PieChart) {
        return React.cloneElement(child as React.ReactElement<any>, {
          data,
          ...child.props,
        })
      }
      if (child.type === RechartsPrimitive.RadarChart) {
        return React.cloneElement(child as React.ReactElement<any>, {
          data,
          ...child.props,
        })
      }
      if (child.type === RechartsPrimitive.RadialBarChart) {
        return React.cloneElement(child as React.ReactElement<any>, {
          data,
          ...child.props,
        })
      }
    }
    return child
  })

  return (
    <ChartContext.Provider
      value={
        {
          config,
          data,
          categories,
          series,
          stack,
        } as ChartContextProps
      }
    >
      <div
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-current [&_.recharts-polar-grid_line]:stroke-border [&_.recharts-radial-bar-background]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line-line]:stroke-border [&_.recharts-sector]:fill-muted [&_.recharts-sector_stroke]:stroke-background [&_.recharts-text]:fill-foreground [&_.recharts-tooltip-item-list]:text-foreground [&_.recharts-tooltip-label]:fill-foreground [&_.recharts-tooltip-wrapper_.recharts-tooltip-item]:text-foreground [&_.recharts-tooltip-wrapper]:bg-background [&_.recharts-tooltip-wrapper]:fill-foreground [&_.recharts-tooltip-wrapper]:stroke-border [&_path.recharts-tooltip-cursor]:stroke-muted-foreground",
          className,
        )}
        {...props}
      >
        {newChildren}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Tooltip> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    formatter?: (value: any, name: string, props: any, index: number, payload: any[]) => string | number
  }
>(({ className, hideLabel = false, hideIndicator = false, formatter, children, ...props }, ref) => {
  const { config } = useChart()

  return (
    <RechartsPrimitive.Tooltip
      content={({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div
              className={cn(
                "grid min-w-[8rem] items-start gap-1.5 rounded-lg border bg-background px-3 py-2 text-xs shadow-md",
                className,
              )}
              ref={ref}
            >
              {!hideLabel && label ? <div className="text-muted-foreground">{label}</div> : null}
              <div className="grid gap-1">
                {payload.map((item, index) => {
                  const key = item.dataKey as keyof typeof config

                  const content = formatter ? formatter(item.value, item.name, item, index, payload) : item.value

                  return (
                    <div key={item.dataKey} className="flex items-center justify-between gap-4">
                      {config[key]?.icon ? (
                        <config.icon className="h-3 w-3" />
                      ) : (
                        !hideIndicator && (
                          <div
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{
                              backgroundColor: item.color,
                            }}
                          />
                        )
                      )}
                      <div className="text-muted-foreground">{config[key]?.label || item.name}</div>
                      <div className="font-medium text-foreground">{content}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        return null
      }}
      {...props}
    />
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Legend> & {
    hideIcon?: boolean
    formatter?: (value: string, entry: RechartsPrimitive.LegendPayload, index: number) => string
  }
>(({ className, hideIcon = false, formatter, ...props }, ref) => {
  const { config } = useChart()

  return (
    <RechartsPrimitive.Legend
      content={({ payload }) => {
        return (
          <div ref={ref} className={cn("flex flex-wrap items-center justify-center gap-4", className)} {...props}>
            {payload?.map((item) => {
              const key = item.dataKey as keyof typeof config
              if (!config[key]) return null

              return (
                <div key={item.value} className="flex items-center gap-1.5">
                  {!hideIcon &&
                    (config[key]?.icon ? (
                      <config.icon className="h-3 w-3" />
                    ) : (
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />
                    ))}
                  <div className="text-muted-foreground">
                    {formatter ? formatter(item.value!, item, 0) : config[key]?.label || item.value}
                  </div>
                </div>
              )
            })}
          </div>
        )
      }}
      {...props}
    />
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

const ChartCrosshair = RechartsPrimitive.Crosshair

const ChartActiveShape = RechartsPrimitive.ActiveShape

const ChartAxis = RechartsPrimitive.XAxis

const ChartYAxis = RechartsPrimitive.YAxis

const ChartBar = RechartsPrimitive.Bar

const ChartLine = RechartsPrimitive.Line

const ChartArea = RechartsPrimitive.Area

const ChartPie = RechartsPrimitive.Pie

const ChartRadar = RechartsPrimitive.Radar

const ChartRadialBar = RechartsPrimitive.RadialBar

const ChartPolarGrid = RechartsPrimitive.PolarGrid

const ChartPolarAngleAxis = RechartsPrimitive.PolarAngleAxis

const ChartPolarRadiusAxis = RechartsPrimitive.PolarRadiusAxis

const ChartResponsiveContainer = RechartsPrimitive.ResponsiveContainer

type ChartProps = React.ComponentPropsWithoutRef<typeof RechartsPrimitive.ResponsiveContainer> & {
  data: { name: string; value: number }[]
  config?: ChartConfig
  className?: string
}

const BarChart = React.forwardRef<HTMLDivElement, ChartProps>(({ data, config, className, ...props }, ref) => (
  <ChartContainer
    ref={ref}
    config={config || {}}
    data={data}
    categories={data.map((d) => d.name)}
    className={className}
    {...props}
  >
    <RechartsPrimitive.BarChart accessibilityLayer data={data}>
      <ChartAxis
        dataKey="name"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <ChartYAxis tickLine={false} axisLine={false} tickMargin={8} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartBar dataKey="value" fill="var(--color-value)" radius={8} />
    </RechartsPrimitive.BarChart>
  </ChartContainer>
))
BarChart.displayName = "BarChart"

const LineChart = React.forwardRef<HTMLDivElement, ChartProps>(({ data, config, className, ...props }, ref) => (
  <ChartContainer
    ref={ref}
    config={config || {}}
    data={data}
    categories={data.map((d) => d.name)}
    className={className}
    {...props}
  >
    <RechartsPrimitive.LineChart accessibilityLayer data={data}>
      <ChartAxis
        dataKey="name"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <ChartYAxis tickLine={false} axisLine={false} tickMargin={8} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLine dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
    </RechartsPrimitive.LineChart>
  </ChartContainer>
))
LineChart.displayName = "LineChart"

const PieChart = React.forwardRef<HTMLDivElement, ChartProps>(({ data, config, className, ...props }, ref) => (
  <ChartContainer ref={ref} config={config || {}} data={data} className={className} {...props}>
    <RechartsPrimitive.PieChart>
      <ChartTooltip content={<ChartTooltipContent />} />
      <RechartsPrimitive.Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <RechartsPrimitive.Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${index * 20 + 20}%)`} />
        ))}
      </RechartsPrimitive.Pie>
      <ChartLegend content={<ChartLegendContent />} />
    </RechartsPrimitive.PieChart>
  </ChartContainer>
))
PieChart.displayName = "PieChart"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartCrosshair,
  ChartActiveShape,
  ChartAxis,
  ChartYAxis,
  ChartBar,
  ChartLine,
  ChartArea,
  ChartPie,
  ChartRadar,
  ChartRadialBar,
  ChartPolarGrid,
  ChartPolarAngleAxis,
  ChartPolarRadiusAxis,
  ChartResponsiveContainer,
  BarChart,
  LineChart,
  PieChart,
}
