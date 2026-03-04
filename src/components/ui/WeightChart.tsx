import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, G, Rect } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { Text } from './Text';
import { Typography } from '@/theme';

interface DataPoint {
  date: string; // 'YYYY-MM-DD'
  value: number;
}

interface WeightChartProps {
  data: DataPoint[];
  height?: number;
  yLabel?: string;
}

const PAD = { top: 20, right: 16, bottom: 48, left: 48 };

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${parseInt(day)}/${parseInt(month)}`;
}

export function WeightChart({ data, height = 200, yLabel = 'kg' }: WeightChartProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width - 32; // margin 16 each side
  const W = screenWidth;
  const H = height;
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  if (data.length < 2) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text variant="caption" color="tertiary" style={{ textAlign: 'center' }}>
          Registra al menos 2 pesos para ver la gráfica
        </Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.floor(Math.min(...values)) - 1;
  const maxVal = Math.ceil(Math.max(...values)) + 1;
  const range = maxVal - minVal || 1;

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => PAD.top + chartH - ((v - minVal) / range) * chartH;

  // Construir path SVG de la línea
  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(d.value).toFixed(1)}`)
    .join(' ');

  // Área rellena bajo la línea
  const areaPath =
    linePath +
    ` L ${toX(data.length - 1).toFixed(1)} ${(PAD.top + chartH).toFixed(1)}` +
    ` L ${toX(0).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} Z`;

  // Líneas horizontales de guía (5 niveles)
  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    minVal + (range / yTicks) * i
  );

  return (
    <View>
      <Svg width={W} height={H}>
        {/* Líneas horizontales guía */}
        {yTickValues.map((val, i) => {
          const y = toY(val);
          return (
            <G key={i}>
              <Line
                x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y}
                stroke={colors.borderLight} strokeWidth={1} strokeDasharray="4,4"
              />
              <SvgText
                x={PAD.left - 6} y={y + 4}
                fontSize={9} fill={colors.textTertiary}
                textAnchor="end" fontFamily={Typography.fontFamily.regular}
              >
                {val.toFixed(1)}
              </SvgText>
            </G>
          );
        })}

        {/* Área rellena */}
        <Path d={areaPath} fill={colors.primary + '18'} />

        {/* Línea principal */}
        <Path
          d={linePath} fill="none"
          stroke={colors.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Puntos y etiquetas */}
        {data.map((d, i) => {
          const x = toX(i);
          const y = toY(d.value);
          const isFirst = i === 0;
          const isLast = i === data.length - 1;
          const showLabel = isFirst || isLast || data.length <= 6;
          return (
            <G key={i}>
              {/* Punto */}
              <Circle cx={x} cy={y} r={4} fill={colors.primary} />
              <Circle cx={x} cy={y} r={2} fill="#FFF" />
              {/* Valor encima */}
              {showLabel && (
                <SvgText
                  x={x} y={y - 10}
                  fontSize={9} fill={colors.primary}
                  textAnchor="middle" fontFamily={Typography.fontFamily.semiBold}
                >
                  {d.value.toFixed(1)}
                </SvgText>
              )}
              {/* Fecha abajo */}
              <SvgText
                x={x} y={H - 8}
                fontSize={9} fill={colors.textSecondary}
                textAnchor="middle" fontFamily={Typography.fontFamily.regular}
              >
                {formatDate(d.date)}
              </SvgText>
            </G>
          );
        })}

        {/* Eje Y label */}
        <SvgText
          x={10} y={PAD.top + chartH / 2}
          fontSize={9} fill={colors.textTertiary}
          textAnchor="middle" fontFamily={Typography.fontFamily.regular}
          rotation="-90" originX={10} originY={PAD.top + chartH / 2}
        >
          {yLabel}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
