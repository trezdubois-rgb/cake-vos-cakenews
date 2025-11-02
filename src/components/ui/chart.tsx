<<<<<<< HEAD
import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;
=======
import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
<<<<<<< HEAD
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
=======
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
<<<<<<< HEAD
    throw new Error('useChart must be used within a <ChartContainer />');
=======
    throw new Error("useChart must be used within a <ChartContainer />");
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
<<<<<<< HEAD
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;
=======
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
<<<<<<< HEAD
          className
=======
          className,
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
<<<<<<< HEAD
ChartContainer.displayName = 'Chart';

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.theme ?? config.color);
=======
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color);
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
<<<<<<< HEAD
      // eslint-disable-next-line react/no-danger
=======
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
<<<<<<< HEAD
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`
          )
          .join('\n'),
=======
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
<<<<<<< HEAD
    React.ComponentProps<'div'> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: 'line' | 'dot' | 'dashed';
=======
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
<<<<<<< HEAD
      indicator = 'dot',
=======
      indicator = "dot",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
<<<<<<< HEAD
    ref
=======
    ref,
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
<<<<<<< HEAD
      const key = `${labelKey ?? item.dataKey ?? item.name ?? 'value'}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label ?? label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>
        );
=======
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      }

      if (!value) {
        return null;
      }

<<<<<<< HEAD
      return <div className={cn('font-medium', labelClassName)}>{value}</div>;
=======
      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

<<<<<<< HEAD
    const nestLabel = payload.length === 1 && indicator !== 'dot';
=======
    const nestLabel = payload.length === 1 && indicator !== "dot";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

    return (
      <div
        ref={ref}
        className={cn(
<<<<<<< HEAD
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
          className
=======
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
<<<<<<< HEAD
            const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? item.payload.fill ?? item.color;
=======
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

            return (
              <div
                key={item.dataKey}
                className={cn(
<<<<<<< HEAD
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center'
=======
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
<<<<<<< HEAD
                          className={cn(
                            'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                            {
                              'h-2.5 w-2.5': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            }
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
=======
                          className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          })}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
<<<<<<< HEAD
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center'
=======
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
<<<<<<< HEAD
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
=======
                        <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
<<<<<<< HEAD
  }
);
ChartTooltipContent.displayName = 'ChartTooltip';
=======
  },
);
ChartTooltipContent.displayName = "ChartTooltip";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
<<<<<<< HEAD
  React.ComponentProps<'div'> &
    Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey }, ref) => {
=======
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
<<<<<<< HEAD
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey ?? item.dataKey ?? 'value'}`;
=======
      className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
<<<<<<< HEAD
            className={cn(
              'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
            )}
=======
            className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
});
<<<<<<< HEAD
ChartLegendContent.displayName = 'ChartLegend';

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) {
=======
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    return undefined;
  }

  const payloadPayload =
<<<<<<< HEAD
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
=======
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

<<<<<<< HEAD
  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
=======
  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
<<<<<<< HEAD
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
=======
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

<<<<<<< HEAD
    if (configLabelKey in config) {
    const safeKey = configLabelKey as keyof typeof config;
    // eslint-disable-next-line security/detect-object-injection
    return config[safeKey];
  }

  const fallbackKey = key as keyof typeof config;
  if (fallbackKey in config) {
    // eslint-disable-next-line security/detect-object-injection
    return config[fallbackKey];
  }

  return null;
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
=======
  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
